// @ts-nocheck
// Live port of the AHOS service loops (ahos-site-film/src/loop.js): the real product running on
// titanium devices, rendered in real time and framed into the space beside the copy.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { warmUp } from "./warm";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type DeviceScene = "web" | "ecom" | "mobile" | "software" | "ai" | "design" | "jul";

export async function createDevices(canvas, { scene: SCENE, base, mobile = false }) {
let W = 2, H = 2, FIT = 1;
let region = { x: 0, y: 0, w: 2, h: 2 };
const TAU = Math.PI * 2;
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const sm = (a, b, x) => { const u = clamp01((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const lerp = (a, b, u) => a + (b - a) * u;

// per-scene setup: which client, accent glow, which devices, loop length
const CFG = {
  web: { site: 'speealigner', accent: '#d8263a', L: 8, laptop: true, phone: true },
  jul: { site: 'julsauto', accent: '#d8263a', L: 8, laptop: true, phone: true, depth: [2.2, 3.4] },
  ecom: { site: 'threads', depth: [1.25, 2.4], accent: '#5fe04a', L: 8, laptop: true, phone: true, notify: ['New order #1042', '2 items · Cash on delivery · Beirut'] },
  mobile: { site: 'idotaxi', accent: '#d4a83a', L: 8, laptop: false, phone: true, twin: true, notify: ['Driver on the way', 'Toyota Camry · arriving in 3 min'] },
  software: { site: null, accent: '#ff6a1a', L: 8, laptop: true, phone: true, dash: true },
  ai: { site: null, accent: '#ff6a1a', L: 10, laptop: false, phone: true, chat: true },
  design: { site: 'threads', accent: '#ff6a1a', L: 8, laptop: false, phone: true, twin: true, wire: true },
}[SCENE];
const L = CFG.L;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = false;
const scene = new THREE.Scene(); scene.background = new THREE.Color('#050506');
const camera = new THREE.PerspectiveCamera(26, 1, 0.05, 100);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04, 0.1, 100, { size: 128 }).texture;
scene.environmentIntensity = 0.7;
try { await Promise.all(['400 30px Inter', '500 30px Inter', '600 30px Inter', '700 30px Inter', '500 20px "JetBrains Mono"'].map((f) => document.fonts.load(f))); } catch {}
const loadImg = async (u) => { const i = new Image(); i.src = u; await i.decode(); return i; };
const [deskImg, mobImg] = CFG.site ? await Promise.all([loadImg(`${base}3d/${CFG.site}-deskfull.webp`), loadImg(`${base}3d/${CFG.site}-mobfull.webp`)]) : [null, null];

function rrect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
function planeUV(geo, w, h) { const p = geo.attributes.position, uv = geo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5); uv.needsUpdate = true; return geo; }
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
const sheen = (w, h) => {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 512; const g = cv.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 256, 512); gr.addColorStop(0, 'rgba(255,255,255,0.08)'); gr.addColorStop(0.42, 'rgba(255,255,255,0.012)'); gr.addColorStop(0.43, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 512);
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, toneMapped: false }));
};
const glass = new THREE.MeshStandardMaterial({ color: '#040405', roughness: 0.06 });
const screenTex = (cw, ch) => {
  const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  return { cv, g: cv.getContext('2d'), t };
};

await new Promise((r) => setTimeout(r, 0)); // yield: keep the main thread responsive while building
// ---------- laptop ----------
const alu = new THREE.MeshStandardMaterial({ color: '#4a4947', metalness: 1, roughness: 0.5 });
const LW = 3.3, LD = 2.25, BT = 0.085, LH = 2.2, LT = 0.05, SW = LW - 0.16, SH = LH - 0.2;
const laptop = new THREE.Group(); scene.add(laptop);
const LCW = mobile ? 960 : 1440;
const lapScr = screenTex(LCW, Math.round(LCW * SH / SW));
{
  const base = new THREE.Mesh(new RoundedBoxGeometry(LW, BT, LD, 6, 0.04), alu); base.position.y = BT / 2; base.castShadow = base.receiveShadow = true; laptop.add(base);
  const cv = document.createElement('canvas'); cv.width = 1400; cv.height = 520; const g = cv.getContext('2d');
  g.fillStyle = '#121214'; g.fillRect(0, 0, 1400, 520);
  const rows = [14, 14, 13, 12, 11]; let y = 16;
  rows.forEach((n) => { const kw = (1400 - 32) / 14; let x = 16 + (14 - n) * kw / 2; for (let i = 0; i < n; i++) { g.fillStyle = '#070708'; g.beginPath(); g.roundRect(x + 4, y + 4, kw - 8, 84, 10); g.fill(); x += kw; } y += 94; });
  g.beginPath(); g.roundRect(450, y + 4, 500, 60, 10); g.fill();
  const kt = new THREE.CanvasTexture(cv); kt.colorSpace = THREE.SRGBColorSpace;
  const keys = new THREE.Mesh(new THREE.PlaneGeometry(2.86, 1.06), new THREE.MeshStandardMaterial({ map: kt, roughness: 0.7 }));
  keys.rotation.x = -Math.PI / 2; keys.position.set(0, BT + 0.001, -0.42); laptop.add(keys);
  const pad = new THREE.Mesh(new THREE.ShapeGeometry(rrect(1.25, 0.74, 0.06), 16), new THREE.MeshStandardMaterial({ color: '#3a3937', metalness: 1, roughness: 0.18 }));
  pad.rotation.x = -Math.PI / 2; pad.position.set(0, BT + 0.001, 0.6); laptop.add(pad);
  const hinge = new THREE.Group(); hinge.position.set(0, BT, -LD / 2 + 0.03); laptop.add(hinge);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(LW, LH, LT, 6, 0.024), alu); lid.position.set(0, LH / 2, -LT / 2); lid.castShadow = true; hinge.add(lid);
  const bezel = new THREE.Mesh(new THREE.ShapeGeometry(rrect(LW - 0.03, LH - 0.03, 0.05), 24), new THREE.MeshStandardMaterial({ color: '#050506', roughness: 0.45, envMapIntensity: 0.25 })); bezel.position.set(0, LH / 2, 0.0015); hinge.add(bezel);
  const scr = new THREE.Mesh(planeUV(new THREE.ShapeGeometry(rrect(SW, SH, 0.02), 8), SW, SH), new THREE.MeshBasicMaterial({ map: lapScr.t, toneMapped: false, color: new THREE.Color(0.93, 0.93, 0.93) }));
  scr.position.set(0, LH / 2 - 0.02, 0.003); hinge.add(scr); lapScr.mat = scr.material;
  const ls = sheen(SW, SH); ls.position.set(0, LH / 2 - 0.02, 0.005); hinge.add(ls);
  const notch = new THREE.Mesh(new THREE.ShapeGeometry(rrect(0.34, 0.07, 0.03), 12), new THREE.MeshBasicMaterial({ color: '#000' })); notch.position.set(0, LH - 0.07, 0.004); hinge.add(notch);
  hinge.rotation.x = -0.26;
}
laptop.visible = CFG.laptop;

await new Promise((r) => setTimeout(r, 0)); // yield: keep the main thread responsive while building
// ---------- phones ----------
const ti = new THREE.MeshStandardMaterial({ color: '#9a968f', metalness: 1, roughness: 0.3 });
const PW = 0.716 * 1.06, PH = 1.47 * 1.06, PR = 0.118, PD = 0.064, PSW = PW - 0.064, PSH = PH - 0.064;
function makePhone() {
  const phone = new THREE.Group(); scene.add(phone);
  const pbody = new THREE.Mesh(new THREE.ExtrudeGeometry(rrect(PW - 0.024, PH - 0.024, PR - 0.012), { depth: PD, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.012, bevelSegments: 8, curveSegments: 48 }), ti);
  pbody.position.z = -PD / 2; pbody.castShadow = true; phone.add(pbody);
  const FZ = PD / 2 + 0.0145;
  const pfront = new THREE.Mesh(new THREE.ShapeGeometry(rrect(PW - 0.01, PH - 0.01, PR - 0.005), 48), glass); pfront.position.z = FZ + 0.0008; phone.add(pfront);
  const PCW = mobile ? 520 : 780;
  const st = screenTex(PCW, Math.round(PCW * PSH / PSW));
  const pscreen = new THREE.Mesh(planeUV(new THREE.ShapeGeometry(rrect(PSW, PSH, PR - 0.03), 48), PSW, PSH), new THREE.MeshBasicMaterial({ map: st.t, toneMapped: false, color: new THREE.Color(0.93, 0.93, 0.93) }));
  pscreen.position.z = FZ + 0.0016; phone.add(pscreen);
  const island = new THREE.Mesh(new THREE.ShapeGeometry(rrect(0.2, 0.058, 0.029), 24), new THREE.MeshBasicMaterial({ color: '#000' })); island.position.set(0, PSH / 2 - 0.052, FZ + 0.002); phone.add(island);
  const ps = sheen(PSW, PSH); ps.position.z = FZ + 0.003; phone.add(ps);
  for (const [x, y, h] of [[PW / 2 + 0.006, 0.3, 0.18], [-PW / 2 - 0.006, 0.38, 0.06], [-PW / 2 - 0.006, 0.21, 0.1]]) { const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.008, h, 6, 12), ti); b.position.set(x, y, 0); phone.add(b); }
  // notification card: its own small texture, drawn once, animated as a mesh
  const noteCv = document.createElement('canvas'); noteCv.width = 780; noteCv.height = 230;
  const noteTex = new THREE.CanvasTexture(noteCv); noteTex.colorSpace = THREE.SRGBColorSpace;
  const NH = PSW * 230 / 780;
  const note = new THREE.Mesh(new THREE.PlaneGeometry(PSW, NH), new THREE.MeshBasicMaterial({ map: noteTex, transparent: true, toneMapped: false, depthWrite: false, opacity: 0 }));
  note.position.set(0, PSH / 2 - NH / 2 - 0.035, FZ + 0.0028); note.visible = false; phone.add(note);
  return { phone, st, mat: pscreen.material, note, noteCv, noteTex, NH };
}
const P1 = makePhone(), P2 = CFG.twin ? makePhone() : null;
P1.phone.visible = CFG.phone;

// layout per scene (subject group centred at x≈0.3, framed to the right third by the view offset)
if (CFG.laptop) {
  laptop.position.set(-0.75, 0, -0.5); laptop.rotation.y = 0.36;
  P1.phone.position.set(1.32, PH / 2 + 0.16, 0.85); P1.phone.rotation.set(-0.05, -0.38, 0.04);
} else if (P2) {
  P1.phone.position.set(-0.45, PH / 2 + 0.1, 0.2); P1.phone.rotation.set(-0.04, 0.32, -0.03);
  P2.phone.position.set(0.75, PH / 2 + 0.04, 0.75); P2.phone.rotation.set(-0.05, -0.36, 0.04);
} else {
  P1.phone.position.set(0.25, PH / 2 + 0.08, 0.4); P1.phone.rotation.set(-0.05, -0.3, 0.03);
}

await new Promise((r) => setTimeout(r, 0)); // yield: keep the main thread responsive while building
// ---------- floor, backdrop, line, lights ----------
// soft contact shadow, baked into a texture (no shadow maps to compile or render)
const blobTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(0,0,0,0.85)'); r.addColorStop(0.5, 'rgba(0,0,0,0.35)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(cv); })();
const blob = (w, d, x, z, o = 0.8) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: o })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.002, z); return m; };
if (CFG.laptop) { const sh = blob(4.4, 3.0, 0, 0); laptop.add(sh); }
for (const P of [P1, P2]) if (P && P.phone.visible !== false) { const sh = blob(1.1, 0.5, P.phone.position.x, P.phone.position.z + 0.05, 0.6); scene.add(sh); }
{
  const cv = document.createElement('canvas'); cv.width = cv.height = 512; const g = cv.getContext('2d');
  const a = new THREE.Color(CFG.accent).multiplyScalar(0.3);
  const r = g.createRadialGradient(256, 250, 0, 256, 256, 256);
  r.addColorStop(0, `rgb(${a.r * 255 + 18},${a.g * 255 + 12},${a.b * 255 + 8})`); r.addColorStop(0.5, 'rgba(16,11,9,1)'); r.addColorStop(1, 'rgba(5,5,6,1)');
  g.fillStyle = r; g.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(30, 16), new THREE.MeshBasicMaterial({ map: t })); m.position.set(0.2, 2.6, -7); scene.add(m);
}
const curve = new THREE.CatmullRomCurve3([V3(-7, 0.004, 3.2), V3(-3, 0.004, 2.0), V3(-0.6, 0.004, 1.55), V3(0.9, 0.004, 1.75), V3(1.9, 0.004, 1.3), V3(2.1, 0.004, 0.55), V3(3.4, 0.004, -0.6), V3(8, 0.004, -2.5)], false, 'centripetal');
scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 500, 0.007, 8, false), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff6a1a').multiplyScalar(2.4), toneMapped: false })));
const glowTex = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.18, 'rgba(255,190,140,.85)'); r.addColorStop(0.5, 'rgba(255,106,26,.22)'); r.addColorStop(1, 'rgba(255,106,26,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(cv); })();
// two signal pulses run the line each loop
const pulses = [0, 0.5].map(() => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: new THREE.Color(1.8, 1.0, 0.5), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); s.scale.setScalar(0.32); scene.add(s); return s; });
// soft spotlights standing in for the studio softboxes (cheap to compile on every GPU)
const soft = (c, i, w, h, p, at = V3(0.2, 0.9, 0)) => { const l = new THREE.SpotLight(c, i * 0.42, 0, Math.min(1.2, 0.35 + Math.max(w, h) * 0.18), 1, 0); l.position.copy(p); l.target.position.copy(at); scene.add(l, l.target); return l; };
{ const fill = new THREE.DirectionalLight('#fff4e8', 0.9); fill.position.set(-3, 3.2, 4); scene.add(fill); }
const rimO = soft('#ff6a1a', 9, 0.16, 3.2, V3(3.4, 1.3, -1.4));
soft('#efe9df', 3, 0.16, 3.2, V3(-3.8, 1.3, -1.8));
const sun = new THREE.DirectionalLight('#fff1e2', 1.1); sun.position.set(-2.5, 6, 3); sun.castShadow = true;
sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048); Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4 }); sun.shadow.radius = 8; sun.shadow.bias = -0.0005; scene.add(sun);
const dust = (() => {
  let s = 11; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647); const n = 500, p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) p.set([(r() - 0.5) * 9, r() * 4, -r() * 7 + 2.5], i * 3);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  return new THREE.Points(g, new THREE.PointsMaterial({ size: 0.012, color: new THREE.Color(0.9, 0.55, 0.3), transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false }));
})();
scene.add(dust);

await new Promise((r) => setTimeout(r, 0)); // yield: keep the main thread responsive while building
// ---------- post ----------
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: mobile ? 0 : 4 }));
composer.setPixelRatio(1);
composer.addPass(new RenderPass(scene, camera));

const bloom = new UnrealBloomPass(new THREE.Vector2(2, 2), 0.45, 0.4, 1.2);
composer.addPass(bloom);
composer.addPass(new OutputPass());
const finish = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, uRes: { value: new THREE.Vector2(2, 2) }, uT: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 uRes; uniform float uT; varying vec2 vUv;
float hh(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){ vec3 col = clamp(texture2D(tDiffuse, vUv).rgb, 0.0, 1.0); col = mix(col, col*col*(3.0-2.0*col), 0.3);
  vec2 c = vUv - 0.5; col *= 1.0 - 0.5 * smoothstep(0.35, 0.95, length(c * vec2(1.0, 0.8)) * 1.3);
  col += (hh(floor(vUv * uRes) + floor(uT * 24.0) * 7.0) - 0.5) * 0.0; gl_FragColor = vec4(col, 1.0); }`,
});
composer.addPass(finish);

// ---------- screen content ----------
// client screenshots: uploaded to the GPU once and scrolled by moving UVs (no per-frame canvas copies)
const MAXT = Math.min(renderer.capabilities.maxTextureSize, mobile ? 4096 : 16384);
function imageTexture(img) {
  let src = img;
  if (img.height > MAXT) { const k = MAXT / img.height; const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = MAXT; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); src = c; }
  const t = new THREE.Texture(src); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true;
  t.userData = { w: src.width, h: src.height };
  return t;
}
function scrollTex(tex, screenAspect, depth, u) {
  const { w, h } = tex.userData;
  const viewH = w / screenAspect;
  const maxY = Math.min(h - viewH, w * depth);
  const y = browse(u) * maxY;
  tex.repeat.set(1, viewH / h);
  tex.offset.set(0, 1 - viewH / h - y / h);
}
const SCROLLING = !!CFG.site && !CFG.wire;
let deskTex = null, mobTex1 = null, mobTex2 = null;
if (SCROLLING) {
  if (CFG.laptop) { deskTex = imageTexture(deskImg); lapScr.mat.map = deskTex; }
  mobTex1 = imageTexture(mobImg); P1.mat.map = mobTex1;
  if (P2) { mobTex2 = mobTex1.clone(); mobTex2.userData = mobTex1.userData; P2.mat.map = mobTex2; }
}
// design scene: work from a small crop of the top of the page, not the full screenshot
const designImg = (() => {
  if (!CFG.wire || !mobImg) return null;
  const c = document.createElement('canvas'); c.width = P1.st.cv.width; c.height = P1.st.cv.height;
  c.getContext('2d').drawImage(mobImg, 0, 0, mobImg.width, mobImg.width * c.height / c.width, 0, 0, c.width, c.height);
  return c;
})();
if (CFG.notify) {
  const NP = P2 || P1;
  const g = NP.noteCv.getContext('2d'), [title, body] = CFG.notify, w = 780 - 48, h = 150, x = 24, y = 40;
  g.clearRect(0, 0, 780, 230);
  g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = 30; g.shadowOffsetY = 10;
  g.fillStyle = 'rgba(28,28,31,0.96)'; rr(g, x, y, w, h, 34); g.fill(); g.shadowColor = 'transparent';
  g.fillStyle = '#ff6a1a'; rr(g, x + 24, y + 30, 76, 76, 20); g.fill();
  g.strokeStyle = '#0a0a0b'; g.lineWidth = 7; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x + 46, y + 69); g.lineTo(x + 58, y + 81); g.lineTo(x + 80, y + 55); g.stroke();
  g.fillStyle = '#efe9df'; g.font = '600 30px Inter'; g.textBaseline = 'middle'; g.fillText(title, x + 124, y + 52);
  g.fillStyle = 'rgba(239,233,223,0.7)'; g.font = '400 25px Inter'; g.fillText(body, x + 124, y + 96);
  g.fillStyle = 'rgba(239,233,223,0.45)'; g.font = '400 22px Inter'; g.textAlign = 'right'; g.fillText('now', x + w - 26, y + 52); g.textAlign = 'left';
  NP.noteTex.needsUpdate = true;
}
// browse: hold at top, scroll down, hold, glide back up. Periodic in L.
function browse(u) {
  if (u < 0.12) return 0;
  if (u < 0.55) return sm(0.12, 0.55, u);
  if (u < 0.68) return 1;
  return 1 - sm(0.68, 0.98, u);
}
function drawScroll(st, img, depth, u) {
  const { g, cv } = st;
  const viewH = img.width * cv.height / cv.width;
  const maxY = Math.min(img.height - viewH, img.width * depth);
  const y = browse(u) * maxY;
  g.drawImage(img, 0, y, img.width, viewH, 0, 0, cv.width, cv.height);
}
function drawNotify(st, title, body, u) {
  // slides down at 22% of the loop, leaves at 62%
  const k = sm(0.2, 0.26, u) * (1 - sm(0.6, 0.66, u));
  if (k <= 0) return;
  const { g, cv } = st; const w = cv.width - 48, h = 150, x = 24, y = lerp(-h - 10, 64, k);
  g.save(); g.globalAlpha = Math.min(1, k * 1.4);
  g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = 30; g.shadowOffsetY = 10;
  g.fillStyle = 'rgba(28,28,31,0.94)'; rr(g, x, y, w, h, 34); g.fill(); g.shadowColor = 'transparent';
  g.fillStyle = '#ff6a1a'; rr(g, x + 24, y + 30, 76, 76, 20); g.fill();
  g.strokeStyle = '#0a0a0b'; g.lineWidth = 7; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x + 46, y + 69); g.lineTo(x + 58, y + 81); g.lineTo(x + 80, y + 55); g.stroke();
  g.fillStyle = '#efe9df'; g.font = '600 30px Inter'; g.textBaseline = 'middle'; g.fillText(title, x + 124, y + 52);
  g.fillStyle = 'rgba(239,233,223,0.7)'; g.font = '400 25px Inter'; g.fillText(body, x + 124, y + 96);
  g.fillStyle = 'rgba(239,233,223,0.45)'; g.font = '400 22px Inter'; g.textAlign = 'right'; g.fillText('now', x + w - 26, y + 52); g.textAlign = 'left';
  g.restore();
}
// generic operations dashboard (fictional data, AHOS palette)
function drawDash(st, u, compact) {
  const { g, cv } = st, w = cv.width, h = cv.height, s = w / 1440;
  g.fillStyle = '#0c0c0e'; g.fillRect(0, 0, w, h);
  const pad = compact ? 36 : 40 * s;
  const ph = TAU * u;
  if (!compact) {
    g.fillStyle = '#121215'; g.fillRect(0, 0, 230 * s, h);
    g.fillStyle = '#ff6a1a'; rr(g, 32 * s, 34 * s, 34 * s, 34 * s, 9 * s); g.fill();
    g.fillStyle = '#efe9df'; g.font = `600 ${22 * s}px Inter`; g.textBaseline = 'middle'; g.fillText('Operations', 80 * s, 52 * s);
    ['Overview', 'Orders', 'Inventory', 'Customers', 'Automations', 'Reports'].forEach((n, i) => {
      if (i === 0) { g.fillStyle = 'rgba(255,106,26,0.12)'; rr(g, 20 * s, (118 + i * 52) * s, 190 * s, 40 * s, 10 * s); g.fill(); }
      g.fillStyle = i === 0 ? '#ff8a4a' : 'rgba(239,233,223,0.55)'; g.font = `500 ${17 * s}px Inter`; g.fillText(n, 40 * s, (138 + i * 52) * s);
    });
  }
  const x0 = compact ? pad : 270 * s, cw = w - x0 - pad;
  g.fillStyle = '#efe9df'; g.font = `600 ${(compact ? 40 : 30 * s)}px Inter`; g.textBaseline = 'alphabetic';
  g.fillText('Today', x0, compact ? 150 : 76 * s);
  g.fillStyle = 'rgba(239,233,223,0.5)'; g.font = `500 ${compact ? 22 : 14 * s}px "JetBrains Mono"`; g.fillText('LIVE · UPDATED JUST NOW', x0, compact ? 190 : 104 * s);
  const kpis = [['Orders', 1180 + Math.round(42 * (0.5 - 0.5 * Math.cos(ph)))], ['Revenue', 'LBP ' + (84 + Math.round(6 * (0.5 - 0.5 * Math.cos(ph)))) + 'M'], ['Avg. dispatch', (11.8 - 1.4 * (0.5 - 0.5 * Math.cos(ph))).toFixed(1) + ' min'], ['Tasks automated', 2400 + Math.round(180 * (0.5 - 0.5 * Math.cos(ph)))]];
  const cols = compact ? 2 : 4, kw = (cw - (cols - 1) * 20 * (compact ? 1 : s)) / cols, kh = compact ? 170 : 120 * s, ky = compact ? 230 : 136 * s;
  kpis.forEach(([k, v], i) => {
    const kx = x0 + (i % cols) * (kw + (compact ? 20 : 20 * s)), yy = ky + Math.floor(i / cols) * (kh + (compact ? 20 : 0));
    g.fillStyle = '#141417'; rr(g, kx, yy, kw, kh, compact ? 24 : 14 * s); g.fill();
    g.strokeStyle = 'rgba(239,233,223,0.07)'; g.lineWidth = 2; g.stroke();
    g.fillStyle = 'rgba(239,233,223,0.55)'; g.font = `500 ${compact ? 22 : 14 * s}px Inter`; g.fillText(k, kx + (compact ? 24 : 20 * s), yy + (compact ? 50 : 36 * s));
    g.fillStyle = '#efe9df'; g.font = `600 ${compact ? 46 : 32 * s}px Inter`; g.fillText(String(v), kx + (compact ? 24 : 20 * s), yy + (compact ? 118 : 86 * s));
  });
  // live chart: the line draws, then a moving scan highlights the latest point
  const cy = ky + (compact ? 2 * kh + 40 : kh + 26 * s), chh = compact ? 520 : 330 * s;
  g.fillStyle = '#141417'; rr(g, x0, cy, cw, chh, compact ? 24 : 14 * s); g.fill();
  g.strokeStyle = 'rgba(239,233,223,0.06)'; g.lineWidth = 1;
  for (let i = 1; i < 5; i++) { const yy = cy + (chh * i) / 5; g.beginPath(); g.moveTo(x0 + 20, yy); g.lineTo(x0 + cw - 20, yy); g.stroke(); }
  const N = 28, pts = [];
  for (let i = 0; i < N; i++) { const f = i / (N - 1); const v = 0.35 + 0.35 * f + 0.12 * Math.sin(f * 9 + 1) + 0.05 * Math.sin(f * 23 + ph); pts.push([x0 + 30 + f * (cw - 60), cy + chh - 30 - v * (chh - 70)]); }
  const grd = g.createLinearGradient(0, cy, 0, cy + chh); grd.addColorStop(0, 'rgba(255,106,26,0.35)'); grd.addColorStop(1, 'rgba(255,106,26,0)');
  g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.lineTo(pts[N - 1][0], cy + chh - 20); g.lineTo(pts[0][0], cy + chh - 20); g.closePath(); g.fillStyle = grd; g.fill();
  g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.strokeStyle = '#ff6a1a'; g.lineWidth = compact ? 5 : 3.5 * s; g.stroke();
  const k = (u * 1.0) % 1, idx = Math.min(N - 1, Math.floor(k * N)); const [px, py] = pts[idx];
  g.fillStyle = 'rgba(255,106,26,0.25)'; g.beginPath(); g.arc(px, py, (compact ? 22 : 14 * s), 0, TAU); g.fill();
  g.fillStyle = '#ffb07a'; g.beginPath(); g.arc(px, py, (compact ? 9 : 6 * s), 0, TAU); g.fill();
  if (!compact) {
    // recent activity table
    const ty = cy + chh + 24 * s, rows = ['Order #1042 dispatched', 'Invoice sent to Nour B.', 'Stock synced, 3 SKUs low', 'Driver assigned, Achrafieh', 'Weekly report generated'];
    g.fillStyle = '#141417'; rr(g, x0, ty, cw, h - ty - 30 * s, 14 * s); g.fill();
    const shift = (u * rows.length) % rows.length;
    for (let i = 0; i < 4; i++) {
      const r = rows[(Math.floor(shift) + i) % rows.length], yy = ty + 40 * s + i * 44 * s;
      g.fillStyle = i === 0 ? '#ff8a4a' : 'rgba(239,233,223,0.3)'; g.beginPath(); g.arc(x0 + 30 * s, yy - 6 * s, 5 * s, 0, TAU); g.fill();
      g.fillStyle = i === 0 ? '#efe9df' : 'rgba(239,233,223,0.62)'; g.font = `500 ${16 * s}px Inter`; g.fillText(r, x0 + 50 * s, yy);
      g.fillStyle = 'rgba(239,233,223,0.4)'; g.font = `500 ${13 * s}px "JetBrains Mono"`; g.textAlign = 'right'; g.fillText(i === 0 ? 'JUST NOW' : `${i * 4} MIN AGO`, x0 + cw - 24 * s, yy); g.textAlign = 'left';
    }
  }
}
// AI assistant answering a customer, message by message
const CHAT = [
  ['in', 'Hi! Do you have the Tech Fleece in size M?', 0.04],
  ['out', 'Hi Nour. Yes, 3 left in black and 1 in grey. Want me to hold one for you?', 0.2],
  ['in', 'Black please. Cash on delivery?', 0.4],
  ['out', 'Done. Order #1043 is confirmed, cash on delivery, arriving tomorrow in Achrafieh.', 0.56],
];
function wrapLines(g, text, maxW) { const words = text.split(' '), out = []; let line = ''; for (const w of words) { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
function drawChat(st, u) {
  const { g, cv } = st, w = cv.width, h = cv.height;
  g.fillStyle = '#0d0d0f'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#141417'; g.fillRect(0, 0, w, 210);
  g.fillStyle = '#efe9df'; g.font = '600 26px Inter'; g.textBaseline = 'middle'; g.fillText('9:41', 54, 50);
  g.fillStyle = '#ff6a1a'; g.beginPath(); g.arc(90, 140, 38, 0, TAU); g.fill();
  g.fillStyle = '#0a0a0b'; g.font = '700 30px Inter'; g.textAlign = 'center'; g.fillText('A', 90, 141); g.textAlign = 'left';
  g.fillStyle = '#efe9df'; g.font = '600 30px Inter'; g.fillText('Store assistant', 146, 126);
  g.fillStyle = '#4ade80'; g.beginPath(); g.arc(152, 162, 7, 0, TAU); g.fill();
  g.fillStyle = 'rgba(239,233,223,0.6)'; g.font = '400 23px Inter'; g.fillText('online, replies instantly', 168, 163);
  const end = 0.9; // everything clears at the end of the loop, then restarts
  const fade = 1 - sm(end, 0.98, u);
  let y = 250; const maxW = w * 0.68;
  g.font = '400 27px Inter';
  CHAT.forEach(([who, text, at], i) => {
    const appear = sm(at, at + 0.035, u);
    // typing indicator before each assistant reply
    if (who === 'out' && u > at - 0.08 && u < at) {
      const bx = 36, bw = 120, bh = 70; g.fillStyle = '#1d1d21'; rr(g, bx, y, bw, bh, 30); g.fill();
      for (let d = 0; d < 3; d++) { const a = 0.35 + 0.65 * Math.max(0, Math.sin(u * 160 - d * 0.9)); g.fillStyle = `rgba(239,233,223,${a * fade})`; g.beginPath(); g.arc(bx + 34 + d * 26, y + bh / 2, 8, 0, TAU); g.fill(); }
    }
    if (appear <= 0) return;
    const lines = wrapLines(g, text, maxW - 60), bh = lines.length * 38 + 40, bw = Math.min(maxW, Math.max(...lines.map((l) => g.measureText(l).width)) + 60);
    const bx = who === 'in' ? w - bw - 36 : 36;
    g.save(); g.globalAlpha = appear * fade; g.translate(0, (1 - appear) * 24);
    g.fillStyle = who === 'in' ? '#ff6a1a' : '#1d1d21'; rr(g, bx, y, bw, bh, 30); g.fill();
    g.fillStyle = who === 'in' ? '#0a0a0b' : '#efe9df'; g.font = `${who === 'in' ? 500 : 400} 27px Inter`;
    lines.forEach((l, k) => g.fillText(l, bx + 30, y + 38 + k * 38));
    g.restore();
    y += bh + 22;
    if (i === CHAT.length - 1 && appear > 0) {
      const ca = sm(at + 0.06, at + 0.1, u) * fade;
      g.save(); g.globalAlpha = ca; g.fillStyle = '#141417'; rr(g, 36, y, w - 72, 150, 26); g.fill(); g.strokeStyle = 'rgba(255,106,26,0.5)'; g.lineWidth = 2; g.stroke();
      g.fillStyle = 'rgba(239,233,223,0.55)'; g.font = '500 20px "JetBrains Mono"'; g.fillText('ORDER #1043 · CONFIRMED', 66, y + 46);
      g.fillStyle = '#efe9df'; g.font = '600 28px Inter'; g.fillText('Tech Fleece · Black · M', 66, y + 92);
      g.fillStyle = 'rgba(239,233,223,0.6)'; g.font = '400 23px Inter'; g.fillText('Cash on delivery · Tomorrow', 66, y + 126);
      g.restore();
    }
  });
  g.fillStyle = '#141417'; rr(g, 30, h - 130, w - 60, 86, 43); g.fill();
  g.fillStyle = 'rgba(239,233,223,0.4)'; g.font = '400 25px Inter'; g.fillText('Message', 70, h - 86);
}
// design: wireframe and the real screen, the seam sweeping between them
function drawDesign(st, img, u, phase) {
  const { g, cv } = st, w = cv.width, h = cv.height;
  const viewH = img.width * h / w;
  g.drawImage(img, 0, 0, img.width, viewH, 0, 0, w, h);
  const seam = (0.5 - 0.5 * Math.cos(TAU * (u + phase))) * 1.15 - 0.075; // 0..1 sweep, periodic
  const sy = clamp01(seam) * h;
  g.save(); g.beginPath(); g.rect(0, sy, w, h - sy); g.clip();
  g.fillStyle = '#060506'; g.fillRect(0, sy, w, h - sy);
  g.strokeStyle = 'rgba(255,106,26,0.22)'; g.lineWidth = 1;
  for (let x = 0; x < w; x += 39) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 0; y < h; y += 39) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.strokeStyle = 'rgba(255,140,70,0.95)'; g.lineWidth = 3;
  [[0, 0, 1, 0.035], [0.06, 0.06, 0.5, 0.1], [0.06, 0.2, 0.62, 0.32], [0.06, 0.35, 0.8, 0.42], [0.06, 0.46, 0.38, 0.5], [0.42, 0.46, 0.72, 0.5], [0.12, 0.56, 0.88, 0.8], [0.3, 0.84, 0.7, 0.9]].forEach(([a, b, c, d]) => { rr(g, a * w + 4, b * h + 4, (c - a) * w - 8, (d - b) * h - 8, 12); g.stroke(); });
  g.fillStyle = 'rgba(255,140,70,0.75)'; g.font = '500 20px "JetBrains Mono"'; g.textBaseline = 'alphabetic';
  [['NAV', 0.06, 0.055], ['H1 / HERO', 0.06, 0.19], ['CTA', 0.06, 0.45], ['PRODUCT', 0.12, 0.55]].forEach(([s, a, b]) => g.fillText(s, a * w + 6, b * h));
  g.restore();
  const grd = g.createLinearGradient(0, sy - 6, 0, sy + 6); grd.addColorStop(0, 'rgba(255,150,80,0)'); grd.addColorStop(0.5, 'rgba(255,170,110,1)'); grd.addColorStop(1, 'rgba(255,150,80,0)');
  g.fillStyle = grd; g.fillRect(0, sy - 6, w, 12);
}

// ---------- camera ----------
function frameCamera(u) {
  const a = 0.05 * Math.sin(TAU * u), b = 0.04 * Math.sin(TAU * u * 2 + 1);
  const r = (CFG.laptop ? 9.6 : P2 ? 6.3 : 5.3) * FIT;
  const base = Math.atan2(-0.6, 9.2);
  camera.position.set(Math.sin(base + a) * r + 0.05, (CFG.laptop ? 2.2 : 1.45) + b, Math.cos(base + a) * r);
  camera.lookAt(CFG.laptop ? 0.05 : P2 ? 0.15 : 0.25, CFG.laptop ? 0.95 : 0.9, 0.1);
  camera.fov = CFG.laptop ? 26 : 28;
  camera.aspect = region.w / region.h;
  camera.setViewOffset(region.w, region.h, -region.x, -region.y, W, H);
  camera.updateProjectionMatrix();
}

let lastScreen = -1;
const renderFrame = (t) => {
  const u = ((t % L) + L) % L / L;
  // screens (texture uploads capped at 30 per second)
  const drawScreens = t - lastScreen >= 1 / 30 || t < lastScreen;
  if (drawScreens) {
  lastScreen = t;
  if (CFG.dash) { drawDash(lapScr, u, false); drawDash(P1.st, (u + 0.3) % 1, true); }
  else if (CFG.chat) drawChat(P1.st, u);
  else if (CFG.wire) { drawDesign(P1.st, designImg, u, 0); drawDesign(P2.st, designImg, u, 0.5); }
  else {
    const [dd, md] = CFG.depth || [2.6, 4.2];
    if (deskTex) scrollTex(deskTex, SW / SH, dd, u);
    scrollTex(mobTex1, PSW / PSH, md, (u + 0.08) % 1);
    if (mobTex2) scrollTex(mobTex2, PSW / PSH, 3.2, (u + 0.5) % 1);
  }
  if (!SCROLLING) { lapScr.t.needsUpdate = CFG.laptop && CFG.dash; P1.st.t.needsUpdate = true; if (P2) P2.st.t.needsUpdate = true; }
  }
  // the order notification slides in and out (22% to 62% of the loop)
  if (CFG.notify) {
    const NP = P2 || P1, k = sm(0.2, 0.26, u) * (1 - sm(0.6, 0.66, u));
    NP.note.visible = k > 0.001; NP.note.material.opacity = Math.min(1, k * 1.4);
    NP.note.position.y = PSH / 2 - NP.NH / 2 - 0.035 + (1 - k) * 0.05;
  }
  // gentle float on phones, periodic
  const f = Math.sin(TAU * u) * 0.025;
  P1.phone.position.y += f - (P1.phone.userData.f || 0); P1.phone.userData.f = f;
  if (P2) { const f2 = Math.sin(TAU * u + 2) * 0.025; P2.phone.position.y += f2 - (P2.phone.userData.f || 0); P2.phone.userData.f = f2; }
  pulses.forEach((p, i) => { const q = (u + i * 0.5) % 1, k = 0.3 + 0.55 * q; p.position.copy(curve.getPointAt(k)); p.position.y = 0.02; p.material.opacity = Math.sin(Math.PI * q); });
  rimO.intensity = 9 + 1.5 * Math.sin(TAU * u);
  dust.rotation.y = 0.04 * Math.sin(TAU * u);
  finish.uniforms.uT.value = t;
  frameCamera(u);
  composer.render();
};
// subject width per scene: the region shape each composition needs before the camera has to pull back
const NEED = CFG.laptop ? 1.25 : P2 ? 0.95 : 0.6;
function resize(w, h, r) {
  W = Math.max(2, Math.round(w)); H = Math.max(2, Math.round(h));
  region = { x: r.x, y: r.y, w: Math.max(2, r.w), h: Math.max(2, r.h) };
  FIT = Math.max(1, NEED / (region.w / region.h));
  renderer.setSize(W, H, false); composer.setSize(W, H);
  bloom.resolution.set(W / 2, H / 2);
  finish.uniforms.uRes.value.set(W, H);
}
resize(canvas.width || 2, canvas.height || 2, { x: 0, y: 0, w: canvas.width || 2, h: canvas.height || 2 });
await new Promise((r) => setTimeout(r, 0)); // yield: keep the main thread responsive while building
await warmUp(renderer, scene, camera, [bloom, finish, ...composer.passes, composer.copyPass], composer.readBuffer);
return {
  render: renderFrame,
  resize,
  dispose() { composer.dispose(); renderer.dispose(); pmrem.dispose(); scene.traverse((o) => { o.geometry?.dispose?.(); }); },
};
}
