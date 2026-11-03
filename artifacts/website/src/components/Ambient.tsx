import { useEffect, useRef } from "react";
import "./ambient.css";

// One fixed WebGL layer behind every page: warm studio light drifting through haze,
// a soft key light that follows the cursor, a faint blueprint dot grid that wakes near
// the pointer, and film grain. Rendered at reduced resolution and 30 fps; pauses when hidden.
const FRAG = /* glsl */ `
precision mediump float;
uniform vec2 uRes; uniform float uT; uniform vec2 uMouse; uniform float uScroll; uniform float uDpr;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ s += a * n(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float t = uT * 0.035;
  // haze: slow warm pools that drift, shifted by scroll so the light seems to sit in depth
  vec2 q = p * 1.6 + vec2(0.0, uScroll * 0.35);
  float haze = fbm(q + vec2(t, -t * 0.7));
  float haze2 = fbm(q * 0.6 - vec2(t * 0.6, t * 0.3) + 3.0);
  vec2 c1 = vec2(asp * (0.78 + 0.08 * sin(uT * 0.05)), 0.82 + 0.06 * cos(uT * 0.04));
  vec2 c2 = vec2(asp * (0.12 + 0.06 * cos(uT * 0.03)), 0.18 + 0.05 * sin(uT * 0.05));
  float pool1 = exp(-dot(p - c1, p - c1) * 2.2);
  float pool2 = exp(-dot(p - c2, p - c2) * 3.0);
  vec3 col = vec3(0.0196, 0.0196, 0.0235);
  col += vec3(0.55, 0.22, 0.07) * pool1 * (0.10 + 0.12 * haze);
  col += vec3(0.42, 0.28, 0.18) * pool2 * (0.05 + 0.08 * haze2);
  // key light following the cursor
  vec2 m = vec2(uMouse.x * asp, uMouse.y);
  float key = exp(-dot(p - m, p - m) * 9.0);
  col += vec3(0.62, 0.30, 0.12) * key * 0.11 * (0.7 + 0.3 * haze);
  // blueprint dot grid: barely there, brighter near the key light
  vec2 g = gl_FragCoord.xy / (28.0 * uDpr);
  vec2 gf = abs(fract(g) - 0.5);
  float dotm = smoothstep(0.09, 0.0, length(gf));
  col += vec3(1.0, 0.62, 0.36) * dotm * (0.012 + 0.09 * key);
  // grain
  col += (h(gl_FragCoord.xy + fract(uT * 7.13) * 91.0) - 0.5) * 0.022;
  gl_FragColor = vec4(col, 1.0);
}`;

export function Ambient() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "low-power" });
    if (!gl) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const scale = window.innerWidth < 900 ? 0.5 : 0.6; // the field is soft: render it small and let the browser scale it

    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }"));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("uRes"), uT = U("uT"), uMouse = U("uMouse"), uScroll = U("uScroll"), uDpr = U("uDpr");

    const resize = () => {
      const w = Math.max(2, Math.round(window.innerWidth * scale)), h = Math.max(2, Math.round(window.innerHeight * scale));
      canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h); gl.uniform1f(uDpr, scale);
    };
    resize();
    let mx = 0.72, my = 0.62, tx = mx, ty = my, raf = 0, last = 0;
    const onMove = (e: PointerEvent) => { tx = e.clientX / window.innerWidth; ty = 1 - e.clientY / window.innerHeight; };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    const t0 = performance.now();
    const draw = (now: number) => {
      mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
      if (!fine) { tx = 0.6 + 0.25 * Math.sin(now / 9000); ty = 0.6 + 0.2 * Math.cos(now / 11000); }
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uScroll, window.scrollY / window.innerHeight);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || now - last < 33) return; // 30 fps is plenty for drifting light
      last = now; draw(now);
    };
    if (reduced) draw(t0 + 4000); else raf = requestAnimationFrame(tick);
    canvas.classList.add("is-ready");
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="amb" aria-hidden="true" />;
}
