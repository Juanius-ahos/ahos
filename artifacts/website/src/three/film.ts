// @ts-nocheck
// Live port of the AHOS film renderer (ahos-site-film/src/scene.js): same scene, rendered in real time.
// The camera frames the subject into a region of the canvas (the space beside or below the copy),
// so the composition holds at any viewport size and the copy is never covered.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { warmUp } from "./warm";

export const DURATION = 12;
const REF_ASPECT = 0.72; // narrowest region the camera path fills without cropping the subject

export async function createFilm(canvas, { phoneShot, mobile = false }) {
let W = 2, H = 2, FIT = 1, EARTH_FIT = 1;
let region = { x: 0, y: 0, w: 2, h: 2 }; // device px
// ---------- helpers ----------
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => { const u = clamp01((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const lerp = (a, b, u) => a + (b - a) * u;
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }
const ORANGE = new THREE.Color('#ff6a1a');

// timeline (film seconds)
const T = { ignite: 0.35, draw0: 1.2, draw1: 3.7, build0: 3.5, build1: 5.5, power: 5.1, live0: 5.7, live1: 6.5, leave: 7.5, cut: 8.25, end: DURATION };

// ---------- renderer ----------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = false;
renderer.localClippingEnabled = true;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#050506');
const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 4000);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04, 0.1, 100, { size: 128 }).texture;
scene.environmentIntensity = 0.7;
const fx = []; // additive objects hidden from the bokeh depth pass
const texLoader = new THREE.TextureLoader();
const loadTex = (u) => texLoader.loadAsync(u).then((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; });

const glowTex = (() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 256;
  const g = cv.getContext('2d'), r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.15, 'rgba(255,190,140,.85)'); r.addColorStop(0.45, 'rgba(255,106,26,.25)'); r.addColorStop(1, 'rgba(255,106,26,0)');
  g.fillStyle = r; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(cv);
})();
function makeSpark(size = 1) {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 3.2, 1.4) }));
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(2.2, 1.2, 0.6), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  halo.scale.setScalar(4.5);
  const light = new THREE.PointLight('#ff7a2a', 0, 0, 2);
  g.add(core, halo, light); g.scale.setScalar(size); g.userData = { core, halo, light };
  fx.push(halo);
  return g;
}

await new Promise((r) => setTimeout(r, 0)); // yield: keep the main thread responsive while building
// ================= STUDIO =================
const studio = new THREE.Group(); scene.add(studio);
const studioFog = new THREE.Fog('#050506', 5, 13);
const PY = 0.95; // phone centre height
function rrect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
function planeUV(geo, w, h) { const p = geo.attributes.position, uv = geo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5); uv.needsUpdate = true; return geo; }

// build sweep: everything of the phone below cutY is solid
const cutPlane = new THREE.Plane(V3(0, -1, 0), 0);
const clip = [cutPlane];
const phone = new THREE.Group(); phone.position.set(0, PY, 0); studio.add(phone);
const PW = 0.716, PH = 1.47, PR = 0.112, PD = 0.06;
const ti = new THREE.MeshStandardMaterial({ color: '#9a968f', metalness: 1, roughness: 0.3, clippingPlanes: clip, clipShadows: true });
const pbody = new THREE.Mesh(new THREE.ExtrudeGeometry(rrect(PW - 0.024, PH - 0.024, PR - 0.012), { depth: PD, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.012, bevelSegments: 8, curveSegments: 48 }), ti);
pbody.position.z = -PD / 2; pbody.castShadow = true; phone.add(pbody);
const FZ = PD / 2 + 0.0145;
const pfront = new THREE.Mesh(new THREE.ShapeGeometry(rrect(PW - 0.01, PH - 0.01, PR - 0.005), 48), new THREE.MeshStandardMaterial({ color: '#050505', roughness: 0.08, clippingPlanes: clip }));
pfront.position.z = FZ + 0.0008; phone.add(pfront);
const SW = PW - 0.062, SH = PH - 0.062;
// screen: wireframe UI -> real store, with a top-down wipe and a power-on glow
const wireCv = document.createElement('canvas'); wireCv.width = 585; wireCv.height = 1260;
const wireTex = new THREE.CanvasTexture(wireCv); wireTex.colorSpace = THREE.SRGBColorSpace;
const realTex = await loadTex(phoneShot);
try { await document.fonts.load('500 15px "JetBrains Mono"'); } catch {}
const scrUni = { uMap2: { value: realTex }, uMix: { value: 0 }, uOn: { value: 0 } };
const screenMat = new THREE.MeshBasicMaterial({ map: wireTex, toneMapped: false, clippingPlanes: clip });
screenMat.onBeforeCompile = (sh) => {
  Object.assign(sh.uniforms, scrUni);
  sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D uMap2; uniform float uMix, uOn;')
    .replace('#include <map_fragment>', `
      vec4 wc = texture2D(map, vMapUv); vec4 rc = texture2D(uMap2, vMapUv);
      float edge = (1.0 - vMapUv.y) - (uMix * 1.25 - 0.12);
      float m = 1.0 - smoothstep(-0.06, 0.0, edge);
      float seam = exp(-edge * edge * 1800.0) * step(0.001, uMix) * step(uMix, 0.999);
      vec3 c = mix(wc.rgb, rc.rgb, m) + vec3(1.0, 0.55, 0.25) * seam * 1.4;
      diffuseColor.rgb *= c * uOn;`);
};
const pscreen = new THREE.Mesh(planeUV(new THREE.ShapeGeometry(rrect(SW, SH, PR - 0.03), 48), SW, SH), screenMat);
pscreen.position.z = FZ + 0.0016; phone.add(pscreen);
const island = new THREE.Mesh(new THREE.ShapeGeometry(rrect(0.19, 0.056, 0.028), 24), new THREE.MeshBasicMaterial({ color: '#000', clippingPlanes: clip }));
island.position.set(0, SH / 2 - 0.05, FZ + 0.002); phone.add(island);
for (const [x, y, h] of [[PW / 2 + 0.006, 0.28, 0.17], [-PW / 2 - 0.006, 0.36, 0.06], [-PW / 2 - 0.006, 0.2, 0.1]]) { const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.008, h, 6, 12), ti); b.position.set(x, y, 0); phone.add(b); }
// camera module on the back
{
  const glassDark = new THREE.MeshStandardMaterial({ color: '#07080a', roughness: 0.05, metalness: 0.2, clippingPlanes: clip });
  const plateMat = new THREE.MeshStandardMaterial({ color: '#8e8a83', metalness: 1, roughness: 0.22, clippingPlanes: clip });
  const BZ = -PD / 2 - 0.0145;
  const plate = new THREE.Mesh(new THREE.ExtrudeGeometry(rrect(0.3, 0.3, 0.07), { depth: 0.008, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 4, curveSegments: 24 }), plateMat);
  plate.position.set(PW / 2 - 0.2, PH / 2 - 0.2, BZ - 0.012); plate.rotation.y = Math.PI; phone.add(plate);
  for (const [x, y] of [[-0.062, 0.062], [-0.062, -0.062], [0.062, 0]]) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.052, 0.024, 40), plateMat);
    ring.rotation.x = Math.PI / 2; ring.position.set(PW / 2 - 0.2 - x, PH / 2 - 0.2 + y, BZ - 0.026); phone.add(ring);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.04, 40), glassDark);
    lens.rotation.y = Math.PI; lens.position.set(ring.position.x, ring.position.y, BZ - 0.0385); phone.add(lens);
  }
  const flashM = new THREE.Mesh(new THREE.CircleGeometry(0.014, 24), new THREE.MeshStandardMaterial({ color: '#d8cfc0', roughness: 0.4, clippingPlanes: clip }));
  flashM.rotation.y = Math.PI; flashM.position.set(PW / 2 - 0.2 - 0.065, PH / 2 - 0.2 - 0.005, BZ - 0.022); phone.add(flashM);
}
// faint glass sheen
{
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 512; const g = cv.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 256, 512); gr.addColorStop(0, 'rgba(255,255,255,0.09)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.015)'); gr.addColorStop(0.41, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 512);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, toneMapped: false, clippingPlanes: clip }));
  m.position.z = FZ + 0.003; phone.add(m);
}

await new Promise((r) => setTimeout(r, 0)); // yield: keep the main thread responsive while building
// ---- the wireframe the spark draws (phone-local coordinates) ----
// UI blocks echo the real Threads layout so the wire visibly becomes the real screen
const sx = (u) => (u - 0.5) * SW, sy = (v) => (0.5 - v) * SH, ZW = FZ + 0.006;
const rectPath = (u0, v0, u1, v1, r = 0.012) => {
  const w = sx(u1) - sx(u0), h = sy(v0) - sy(v1);
  return rrect(w, h, Math.min(r, w / 2, h / 2)).getSpacedPoints(80).map((p) => V3(p.x + (sx(u0) + sx(u1)) / 2, p.y + (sy(v0) + sy(v1)) / 2, ZW));
};
const outline = rrect(PW + 0.004, PH + 0.004, PR).getSpacedPoints(260).map((p) => V3(p.x, p.y, ZW));
const WIRES = [
  outline,
  rectPath(0.0, 0.0, 1.0, 0.035, 0.0),          // promo bar
  rectPath(0.06, 0.06, 0.5, 0.1),               // logo / nav
  rectPath(0.06, 0.2, 0.62, 0.32),              // headline
  rectPath(0.06, 0.35, 0.8, 0.42),              // body copy
  rectPath(0.06, 0.46, 0.38, 0.5),              // button 1
  rectPath(0.42, 0.46, 0.72, 0.5),              // button 2
  rectPath(0.12, 0.56, 0.88, 0.8, 0.03),        // product visual
  rectPath(0.3, 0.84, 0.7, 0.9),                // product label
];
const wireMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(ORANGE).multiplyScalar(2.6), toneMapped: false, transparent: true });
const wireLens = WIRES.map((pts) => pts.reduce((s, p, i) => (i ? s + p.distanceTo(pts[i - 1]) : 0), 0));
const wireTotal = wireLens.reduce((a, b) => a + b, 0);
const wireMeshes = WIRES.map((pts, i) => {
  const segs = pts.length * 2;
  const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0), segs, i === 0 ? 0.0032 : 0.0022, 6, false);
  const m = new THREE.Mesh(geo, wireMat); m.userData = { segs, idx: 6 * 6, pts };
  phone.add(m); return m;
});
// head of the drawing at overall progress u (0..1) along all wires, in phone-local space
function wireHead(u) {
  let d = u * wireTotal;
  for (let i = 0; i < WIRES.length; i++) {
    if (d <= wireLens[i] || i === WIRES.length - 1) {
      const pts = WIRES[i]; let acc = 0;
      for (let k = 1; k < pts.length; k++) { const s = pts[k].distanceTo(pts[k - 1]); if (acc + s >= d) return pts[k - 1].clone().lerp(pts[k], (d - acc) / s); acc += s; }
      return pts[pts.length - 1].clone();
    }
    d -= wireLens[i];
  }
  return V3(0, 0, 0);
}
function setWire(u) {
  let d = u * wireTotal;
  wireMeshes.forEach((m, i) => {
    const f = clamp01(d / wireLens[i]); d -= wireLens[i];
    m.visible = f > 0; m.geometry.setDrawRange(0, Math.floor(f * m.userData.segs) * m.userData.idx);
  });
}
// the same layout painted on the screen while it is still a wireframe
{
  const g = wireCv.getContext('2d'), w = 585, h = 1260;
  g.fillStyle = '#060506'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(255,106,26,0.25)'; g.lineWidth = 1;
  for (let x = 0; x < w; x += 39) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 0; y < h; y += 39) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.strokeStyle = 'rgba(255,140,70,0.95)'; g.lineWidth = 3;
  for (const pts of WIRES.slice(1)) {
    g.beginPath(); pts.forEach((p, i) => { const X = (p.x / SW + 0.5) * w, Y = (0.5 - p.y / SH) * h; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }); g.stroke();
  }
  g.fillStyle = 'rgba(255,140,70,0.7)'; g.font = '500 15px "JetBrains Mono"';
  [['NAV', 0.06, 0.055], ['H1 / HERO', 0.06, 0.19], ['CTA', 0.06, 0.45], ['PRODUCT', 0.12, 0.55]].forEach(([s, u, v]) => g.fillText(s, u * w + 4, v * h));
  wireTex.needsUpdate = true;
}
// glowing cut ring where the body is being formed
const ringShape = rrect(PW + 0.03, PD + 0.05, 0.04); ringShape.holes.push(rrect(PW + 0.002, PD + 0.02, 0.03));
const cutRing = new THREE.Mesh(new THREE.ShapeGeometry(ringShape, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 2.2, 0.8), toneMapped: false, transparent: true, side: THREE.DoubleSide }));
cutRing.rotation.x = -Math.PI / 2; studio.add(cutRing);
const cutGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(1.1, 0.55, 0.25), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
cutGlow.scale.set(0.95, 0.1, 1); studio.add(cutGlow); fx.push(cutGlow);

const spark = makeSpark(0.03); studio.add(spark);
spark.userData.halo.material.depthTest = false; spark.userData.halo.renderOrder = 20;

await new Promise((r) => setTimeout(r, 0)); // yield: keep the main thread responsive while building
// ---- floor, backdrop, AHOS line ----
// soft contact shadow, baked into a texture (no shadow maps to compile or render)
const blobTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(0,0,0,0.85)'); r.addColorStop(0.5, 'rgba(0,0,0,0.35)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(cv); })();
const blob = (w, d, x, z, o = 0.8) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: o })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.002, z); return m; };
const floorShadow = blob(1.3, 0.55, 0, 0.05, 0.75); studio.add(floorShadow);
const backdrop = (() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 512; const g = cv.getContext('2d');
  const r = g.createRadialGradient(256, 250, 0, 256, 256, 256); r.addColorStop(0, 'rgba(66,32,15,1)'); r.addColorStop(0.45, 'rgba(22,12,8,1)'); r.addColorStop(1, 'rgba(5,5,6,1)');
  g.fillStyle = r; g.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(30, 16), new THREE.MeshBasicMaterial({ map: t, fog: false }));
  m.position.set(0, 3, -7); return m;
})();
studio.add(backdrop);
const linePts = [V3(-9, 0.004, 3.5), V3(-4, 0.004, 2.2), V3(-1.4, 0.004, 1.05), V3(-0.45, 0.004, 0.55), V3(0, 0.004, 0.42), V3(0.45, 0.004, 0.55), V3(0.6, 0.004, 0.05), V3(0.2, 0.004, -0.5), V3(1.5, 0.004, -1.6), V3(5, 0.004, -3.5), V3(12, 0.004, -5)];
const lineCurve = new THREE.CatmullRomCurve3(linePts, false, 'centripetal');
const LSEG = 700;
const lineGeo = new THREE.TubeGeometry(lineCurve, LSEG, 0.006, 8, false);
const line = new THREE.Mesh(lineGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(ORANGE).multiplyScalar(2.2), toneMapped: false }));
studio.add(line);
const linePool = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.35, 0.35), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.1, color: new THREE.Color(1, 0.5, 0.2) }), 220);
{ const m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)); for (let i = 0; i < 220; i++) { m.compose(lineCurve.getPointAt(i / 219), q, V3(1, 1, 1)); linePool.setMatrixAt(i, m); } }
linePool.frustumCulled = false; studio.add(linePool); fx.push(linePool);
const lineSpark = makeSpark(0.05); studio.add(lineSpark);

// ---- lights ----
// soft spotlights standing in for the studio softboxes (cheap to compile on every GPU)
const softbox = (color, intensity, w, h, pos) => { const l = new THREE.SpotLight(color, intensity * 0.42, 0, Math.min(1.2, 0.35 + Math.max(w, h) * 0.18), 1, 0); l.position.copy(pos); l.target.position.set(0, PY, 0); studio.add(l, l.target); return l; };
const keyBox = softbox('#fff4e8', 3.0, 2.4, 2.4, V3(-2.2, PY + 1.8, 3.2));
const rimO = softbox('#ff6a1a', 9, 0.12, 2.6, V3(1.5, PY + 0.2, -1.4));
const rimC = softbox('#efe9df', 4, 0.12, 2.6, V3(-1.6, PY + 0.1, -1.2));
const sun = new THREE.DirectionalLight('#fff1e2', 0.9); sun.position.set(-1.5, 5, 2.5); sun.castShadow = true;
sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048); Object.assign(sun.shadow.camera, { left: -2, right: 2, top: 2, bottom: -2 }); sun.shadow.radius = 8; sun.shadow.bias = -0.0005;
studio.add(sun);
const dust = (() => {
  const r = rng(11), n = mobile ? 350 : 700, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) p.set([(r() - 0.5) * 7, r() * 3.2, -r() * 6 + 2], i * 3);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ size: 0.01, color: new THREE.Color(0.9, 0.55, 0.3), transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }));
})();
studio.add(dust); fx.push(dust);

await new Promise((r) => setTimeout(r, 0)); // yield: keep the main thread responsive while building
// ================= EARTH (launch) =================
const EA = V3(0, 0, -30000), RE = 100;
const eaSet = new THREE.Group(); eaSet.position.copy(EA); scene.add(eaSet);
const NOISE = /* glsl */`
float h3(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float vn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(h3(i), h3(i+vec3(1,0,0)), f.x), mix(h3(i+vec3(0,1,0)), h3(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i+vec3(0,0,1)), h3(i+vec3(1,0,1)), f.x), mix(h3(i+vec3(0,1,1)), h3(i+vec3(1,1,1)), f.x), f.y), f.z); }
float fbm(vec3 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ s += a * vn(p); p *= 2.03; a *= 0.5; } return s; }
float lights(vec3 n, float S){ vec3 q = n * S; vec3 c = floor(q); vec3 f = fract(q) - 0.5; f -= n * dot(f, n); return step(0.8, h3(c)) * exp(-dot(f, f) * 26.0); }`;
const earthUni = { uLit: { value: 0 } };
const earth = new THREE.Mesh(new THREE.SphereGeometry(RE, mobile ? 128 : 192, mobile ? 64 : 96), new THREE.ShaderMaterial({
  uniforms: earthUni,
  vertexShader: 'varying vec3 vN; varying vec3 vW; void main(){ vN = normalize(position); vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
  fragmentShader: /* glsl */`
${NOISE}
uniform float uLit; varying vec3 vN; varying vec3 vW;
void main(){
  vec3 n = normalize(vN);
  float land = smoothstep(0.5, 0.54, fbm(n * 2.3 + 3.1));
  float pop = smoothstep(0.42, 0.72, fbm(n * 9.0 + 1.7)) * land;
  vec3 c = mix(vec3(0.004, 0.006, 0.01), vec3(0.012, 0.011, 0.01), land);
  // cities switch on in a wave spreading from the launch point
  float reach = smoothstep(uLit * 2.4 - 0.25, uLit * 2.4, acos(clamp(dot(n, normalize(vec3(0.15, 0.55, 0.82))), -1.0, 1.0)));
  float L = (lights(n, 220.0) * pop * 2.2 + lights(n, 600.0) * pop * 1.2) * (0.12 + 0.88 * (1.0 - reach));
  c += vec3(1.0, 0.5, 0.18) * L;
  vec3 V = normalize(cameraPosition - vW);
  c += vec3(1.0, 0.55, 0.3) * pow(1.0 - max(dot(n, V), 0.0), 4.0) * 0.18;
  gl_FragColor = vec4(c, 1.0);
}`,
}));
eaSet.add(earth);
const atmo = new THREE.Mesh(new THREE.SphereGeometry(RE * 1.035, 96, 48), new THREE.ShaderMaterial({
  vertexShader: 'varying vec3 vN; varying vec3 vW; void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
  fragmentShader: 'varying vec3 vN; varying vec3 vW; void main(){ vec3 V = normalize(cameraPosition - vW); float f = dot(normalize(vN), V); float g = pow(clamp(f + 0.32, 0.0, 1.0), 3.0) * (1.0 - smoothstep(0.0, 0.32, f)); gl_FragColor = vec4(mix(vec3(1.0,0.42,0.12), vec3(0.94,0.9,0.85), 0.35) * g * 1.3, 1.0); }',
  side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
}));
eaSet.add(atmo); fx.push(atmo);
const LAUNCH = V3(0.15, 0.55, 0.82).normalize();
const DESTS = [V3(0.35, 0.75, 0.56), V3(-0.55, 0.55, 0.62), V3(0.8, 0.2, 0.55), V3(-0.15, 0.25, 0.95), V3(0.1, -0.35, 0.93), V3(-0.8, 0.05, 0.6), V3(0.6, -0.1, 0.8), V3(-0.4, -0.2, 0.9)].map((v) => v.normalize());
// arcs from the launch point out to the world
const NSP = mobile ? 1200 : 2200, STAIL = 6;
const spGeo = new THREE.BufferGeometry();
{
  const r = rng(17), a = new Float32Array(NSP * STAIL * 3), b = new Float32Array(NSP * STAIL * 3), info = new Float32Array(NSP * STAIL * 2), pos = new Float32Array(NSP * STAIL * 3);
  for (let i = 0; i < NSP; i++) {
    const u = r() * 2 - 1, th = r() * 6.283, s = Math.sqrt(1 - u * u);
    const dst = r() < 0.5 ? DESTS[Math.floor(r() * DESTS.length)] : V3(s * Math.cos(th), u * 0.8, s * Math.sin(th) * 0.7 + 0.5).normalize();
    const ph = r(), sp = 0.35 + r() * 0.5;
    for (let k = 0; k < STAIL; k++) { const j = i * STAIL + k; a.set([LAUNCH.x, LAUNCH.y, LAUNCH.z], j * 3); b.set([dst.x, dst.y, dst.z], j * 3); info.set([ph, k / STAIL + sp * 10], j * 2); }
  }
  spGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); spGeo.setAttribute('aA', new THREE.BufferAttribute(a, 3)); spGeo.setAttribute('aB', new THREE.BufferAttribute(b, 3)); spGeo.setAttribute('aI', new THREE.BufferAttribute(info, 2));
}
const arcs = new THREE.Points(spGeo, new THREE.ShaderMaterial({
  uniforms: { uT: { value: 0 }, uFade: { value: 1 }, uGate: { value: 0 }, uPx: { value: 260 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: /* glsl */`
attribute vec3 aA; attribute vec3 aB; attribute vec2 aI; uniform float uT, uGate, uPx; varying float vB;
void main(){
  float k = fract(aI.y); float sp = floor(aI.y) / 10.0;
  float u = fract(uT * sp + aI.x) - k * 0.035;
  float ok = step(0.0, u) * step(u, 1.0) * step(aI.x, uGate);
  u = clamp(u, 0.0, 1.0);
  float om = acos(clamp(dot(aA, aB), -1.0, 1.0));
  vec3 d = (sin((1.0 - u) * om) * aA + sin(u * om) * aB) / max(sin(om), 1e-3);
  vec3 p = normalize(d) * ${RE.toFixed(1)} * (1.0 + 0.22 * sin(3.14159 * u) * om);
  vB = ok * (1.0 - k) * smoothstep(0.0, 0.08, u) * (1.0 - smoothstep(0.85, 1.0, u));
  vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
  gl_PointSize = (3.0 - k * 0.35) * uPx / -mv.z;
}`,
  fragmentShader: 'uniform float uFade; varying float vB; void main(){ vec2 c = gl_PointCoord - 0.5; float g = exp(-dot(c,c) * 14.0); gl_FragColor = vec4(vec3(1.0, 0.5, 0.18) * g * vB * 2.6 * uFade, 1.0); }',
}));
arcs.frustumCulled = false; eaSet.add(arcs); fx.push(arcs);
const launchSpark = makeSpark(2.4); launchSpark.position.copy(LAUNCH).multiplyScalar(RE * 1.004); eaSet.add(launchSpark);
const starGeo = new THREE.BufferGeometry();
{ const r = rng(5), p = new Float32Array(2500 * 3); for (let i = 0; i < 2500; i++) { const u = r() * 2 - 1, th = r() * 6.283, q = Math.sqrt(1 - u * u); p.set([q * Math.cos(th) * 1500, u * 1500, q * Math.sin(th) * 1500], i * 3); } starGeo.setAttribute('position', new THREE.BufferAttribute(p, 3)); }
eaSet.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, color: new THREE.Color(0.7, 0.68, 0.64), transparent: true, opacity: 0.8 })));

await new Promise((r) => setTimeout(r, 0)); // yield: keep the main thread responsive while building
// ---------- post ----------
const rt = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: mobile ? 0 : 4 });
const composer = new EffectComposer(renderer, rt);
composer.setPixelRatio(1);
composer.addPass(new RenderPass(scene, camera));
const bokeh = { enabled: false, uniforms: { focus: { value: 0 }, aperture: { value: 0 }, nearClip: { value: 0 }, farClip: { value: 0 } } };
const bloom = new UnrealBloomPass(new THREE.Vector2(2, 2), 0.55, 0.5, 0.9);
composer.addPass(bloom);
composer.addPass(new OutputPass());
const finish = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uCA: { value: 0.0015 }, uVig: { value: 0.55 }, uGrain: { value: 0 }, uRes: { value: new THREE.Vector2(2, 2) }, uFlash: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: /* glsl */`
uniform sampler2D tDiffuse; uniform float uTime, uCA, uVig, uGrain, uFlash; uniform vec2 uRes; varying vec2 vUv;
float hh(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 c = vUv - 0.5; vec2 o = c * uCA * (0.4 + 2.0 * dot(c, c));
  vec3 col = vec3(texture2D(tDiffuse, vUv + o).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - o).b);
  col = clamp(col, 0.0, 1.0); col = mix(col, col * col * (3.0 - 2.0 * col), 0.35);
  float l = dot(col, vec3(0.299, 0.587, 0.114));
  float asp = uRes.x / uRes.y;
  col *= mix(1.0, (1.0 - smoothstep(0.3, 0.98, length(c * vec2(min(asp, 1.0), min(1.0 / asp, 1.0)) * 1.25))), uVig);
  col = mix(col, vec3(1.0, 0.92, 0.85), uFlash);
  col += (hh(floor(vUv * uRes) + fract(uTime * 7.31) * 113.0) - 0.5) * uGrain * (0.35 + 0.65 * (1.0 - l));
  gl_FragColor = vec4(col, 1.0);
}`,
});
composer.addPass(finish);

// ---------- camera path (studio) ----------
// keys: [t, position, target, fov]; landscape and portrait framings share timing
const KEYS = [
  [0.0, V3(0.0, PY, 1.6), V3(0, PY, 0), 28],
  [1.2, V3(0.35, PY + 0.1, 3.0), V3(0, PY + 0.02, 0), 28],
  [3.7, V3(-1.9, PY + 0.7, 4.0), V3(0.05, PY, 0), 28],
  [5.6, V3(-1.3, PY - 0.25, 3.9), V3(0, PY + 0.02, 0), 28],
  [6.8, V3(0.7, PY + 0.06, 3.8), V3(0.02, PY + 0.02, 0), 28],
  [7.6, V3(0.4, PY + 0.25, 3.0), V3(0, PY + 0.5, 0), 32],
  [8.3, V3(0.15, PY + 0.3, 2.4), V3(0, PY + 1.5, 0), 40],
];
const camPosCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => k[1]), false, 'centripetal');
const camTgtCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => k[2]), false, 'centripetal');
function camAt(t) {
  // map t to the curve parameter through the key times (piecewise, eased inside each span)
  let i = 0; while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const f = clamp01((t - a[0]) / (b[0] - a[0]));
  const e = 0.5 * f + 0.5 * f * f * (3 - 2 * f);
  const u = (i + e) / (KEYS.length - 1);
  return { p: camPosCurve.getPoint(u), t: camTgtCurve.getPoint(u), fov: lerp(a[3], b[3], e) };
}

// idle: the opening frame kept alive (breathing spark, drifting camera and dust), periodic in IDLE_L
const IDLE_L = 4; let idleU = null;
const renderIdle = (t) => { idleU = ((t % IDLE_L) + IDLE_L) % IDLE_L / IDLE_L; renderFrame(0); idleU = null; };
function applyRegion() {
  camera.aspect = region.w / region.h;
  camera.setViewOffset(region.w, region.h, -region.x, -region.y, W, H);
}

const renderFrame = (t) => {
  let flash = 0, bok = { on: true, focus: 1, ap: 0.0025 };
  const inStudio = t < T.cut;
  studio.visible = inStudio; eaSet.visible = !inStudio; scene.fog = inStudio ? studioFog : null;
  studioFog.near = 5 * FIT; studioFog.far = 13 * FIT;
  finish.uniforms.uCA.value = 0.0015;

  if (inStudio) {
    // spark: ignites, then draws the wireframe, then rides the build cut, then leaves upward
    const ign = 0.45 + 0.55 * smooth(0, T.ignite + 0.5, t);
    const drawU = smooth(T.draw0, T.draw1, t);
    setWire(drawU);
    wireMat.opacity = 1 - smooth(T.power, T.live0 + 0.2, t);
    wireMeshes.forEach((m) => { if (wireMat.opacity <= 0.001) m.visible = false; });
    const build = smooth(T.build0, T.build1, t);
    const cutY = PY - PH / 2 - 0.05 + build * (PH + 0.12);
    cutPlane.constant = cutY;
    const building = build > 0 && build < 1;
    cutRing.visible = cutGlow.visible = building;
    cutRing.position.set(0, cutY, 0); cutGlow.position.set(0, cutY, 0.05);
    cutRing.material.opacity = smooth(0, 0.05, build) * (1 - smooth(0.9, 0.98, build));
    cutGlow.material.opacity = cutRing.material.opacity;

    let sp;
    if (t < T.draw0) sp = phone.localToWorld(V3(0, 0, ZW)).lerp(phone.localToWorld(wireHead(0)), smooth(T.ignite + 0.3, T.draw0, t));
    else if (t < T.draw1) sp = phone.localToWorld(wireHead(drawU));
    else if (t < T.leave) sp = phone.localToWorld(V3(0.05, -0.1, ZW + 0.01)).lerp(V3(0.28, cutY, 0.06), building ? 1 : 0);
    else sp = phone.localToWorld(V3(0, SH / 2 - 0.15, ZW + 0.02)).add(V3(0, Math.pow(smooth(T.leave, T.cut, t), 2) * 1.7, 0.1 * smooth(T.leave, T.cut, t)));
    phone.updateMatrixWorld(true);
    const sparkOn = t < T.draw1 + 0.15 || t > T.leave - 0.2;
    spark.visible = ign > 0 && sparkOn;
    spark.position.copy(sp);
    const pop = t < T.draw0 ? Math.exp(-Math.max(0, t - T.ignite) * 3) : 0;
    spark.scale.setScalar(0.028 * (ign + 1.6 * pop) * (t > T.leave ? 1 + smooth(T.leave, T.cut, t) * 1.5 : 1) * (idleU === null ? 1 : 1 + 0.22 * Math.sin(Math.PI * 2 * idleU)));
    if (idleU !== null) spark.userData.light.intensity = ign * (0.5 + 0.2 * Math.sin(Math.PI * 2 * idleU));
    spark.userData.light.intensity = ign * 0.5;

    // screen powers on with the wireframe, then wipes to the real store
    scrUni.uOn.value = 0.22 * smooth(T.build0, T.build0 + 0.3, t) + 0.78 * smooth(T.power, T.power + 0.35, t) + 0.4 * Math.exp(-Math.max(0, t - T.power) * 6) * (t > T.power ? 1 : 0);
    scrUni.uMix.value = smooth(T.live0, T.live1, t);

    // floor line draws in with the build, spark travels it once the phone is live
    const ld = smooth(T.build0 - 0.3, T.live1, t);
    lineGeo.setDrawRange(0, Math.floor(ld * LSEG) * 8 * 6);
    linePool.count = Math.floor(ld * 220);
    lineSpark.visible = t > T.live1;
    lineSpark.position.copy(lineCurve.getPointAt((0.42 + Math.max(0, t - T.live1) * 0.1) % 1)); lineSpark.position.y = 0.02;

    // the phone turns slowly through the whole take
    phone.rotation.set(-0.04, lerp(-0.32, -0.32 + Math.PI * 2 + 0.12, smooth(T.build0 - 0.2, T.power + 0.35, t)) + 0.05 * Math.sin(t * 0.5), 0.03);
    const lightsUp = smooth(T.build0, T.build1, t);
    keyBox.intensity = lerp(0.6, 3.0, lightsUp); rimC.intensity = lerp(1, 4, lightsUp);
    rimO.intensity = 9 + 2 * Math.sin(t * 0.9);

    const c = camAt(t);
    camera.position.copy(c.p).sub(c.t).multiplyScalar(FIT).add(c.t);
    if (idleU !== null) camera.position.add(V3(0.035 * Math.sin(Math.PI * 2 * idleU), 0.018 * Math.sin(Math.PI * 4 * idleU), 0.05 * (0.5 - 0.5 * Math.cos(Math.PI * 2 * idleU))));
    camera.lookAt(c.t); camera.fov = c.fov;
    bok = { on: true, focus: c.p.distanceTo(phone.position), ap: t < T.draw0 ? 0.006 : 0.0028 };
    flash = smooth(T.cut - 0.12, T.cut, t) * 0.85;
    dust.rotation.y = idleU === null ? t * 0.015 : 0.06 * Math.sin(Math.PI * 2 * idleU);
    camera.near = 0.01; camera.far = 60 * FIT;
    applyRegion();
  } else {
    // launch: the signal lands and the world lights up
    const u = smooth(T.cut, T.end, t);
    earthUni.uLit.value = smooth(T.cut + 0.2, T.end - 0.5, t);
    arcs.material.uniforms.uT.value = t;
    arcs.material.uniforms.uGate.value = smooth(T.cut + 0.1, T.end - 1.2, t);
    launchSpark.userData.light.intensity = 0;
    launchSpark.scale.setScalar(2.4 * (1 + 2.2 * Math.exp(-(t - T.cut) * 3)));
    const dir = V3(lerp(0.2, 0.08, u), lerp(0.5, 0.2, u), 1).normalize();
    const dist = lerp(150, 290, u * u * 0.35 + u * 0.65) * EARTH_FIT;
    camera.position.copy(EA).addScaledVector(dir, dist);
    camera.lookAt(EA.clone().add(V3(0, lerp(42, 0, u), 0)));
    camera.fov = 36;
    flash = (1 - smooth(T.cut, T.cut + 0.35, t)) * 0.85;
    bok = { on: false, focus: 1, ap: 0 };
    camera.near = 1; camera.far = 4000;
    applyRegion();
  }
  camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  bokeh.enabled = bok.on;
  bokeh.uniforms.focus.value = bok.focus; bokeh.uniforms.aperture.value = bok.ap;
  bokeh.uniforms.nearClip.value = camera.near; bokeh.uniforms.farClip.value = camera.far;
  finish.uniforms.uTime.value = idleU === null ? t : idleU * IDLE_L; finish.uniforms.uFlash.value = flash;
  composer.render();
};

// size the canvas and the framing region (all in device pixels)
function resize(w, h, r) {
  W = Math.max(2, Math.round(w)); H = Math.max(2, Math.round(h));
  region = { x: r.x, y: r.y, w: Math.max(2, r.w), h: Math.max(2, r.h) };
  FIT = Math.max(1, REF_ASPECT / (region.w / region.h));
  EARTH_FIT = Math.max(1, 1.3 / (region.w / region.h)); // the globe is wide: fit it by width
  renderer.setSize(W, H, false); composer.setSize(W, H);
  bloom.resolution.set(W / 2, H / 2);
  finish.uniforms.uRes.value.set(W, H);
  arcs.material.uniforms.uPx.value = 260 * region.h / 1080;
}
resize(canvas.width || 2, canvas.height || 2, { x: 0, y: 0, w: canvas.width || 2, h: canvas.height || 2 });
{
  const vis = []; scene.traverse((o) => { vis.push([o, o.visible]); o.visible = true; });
  await warmUp(renderer, scene, camera, [bloom, finish, ...composer.passes, composer.copyPass], composer.readBuffer);
  vis.forEach(([o, v]) => (o.visible = v));
}
return {
  render: renderFrame,
  renderIdle,
  resize,
  dispose() { composer.dispose(); renderer.dispose(); pmrem.dispose(); scene.traverse((o) => { o.geometry?.dispose?.(); }); },
};
}
