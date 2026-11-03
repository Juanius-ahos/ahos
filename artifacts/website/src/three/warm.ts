import * as THREE from "three";

/** Compile every post-processing shader and upload every texture before the first frame,
 *  asynchronously, so the first render never stalls the main thread. */
export async function warmUp(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, passes: unknown[], target?: THREE.WebGLRenderTarget) {
  const mats = new Set<THREE.Material>();
  const grab = (v: unknown) => {
    if (!v) return;
    if (Array.isArray(v)) v.forEach(grab);
    else if (v instanceof THREE.Material) mats.add(v);
  };
  for (const p of passes) {
    if (!p) continue;
    for (const v of Object.values(p as Record<string, unknown>)) grab(v);
  }
  const quad = new THREE.Scene();
  const geo = new THREE.PlaneGeometry(2, 2);
  mats.forEach((m) => quad.add(new THREE.Mesh(geo, m)));
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  // shader variants depend on where they draw: compile for the offscreen buffer the composer uses,
  // and for the screen (the final pass), so the first real frame finds every program ready
  const prev = renderer.getRenderTarget();
  if (target) {
    renderer.setRenderTarget(target);
    await renderer.compileAsync(scene, camera);
    await renderer.compileAsync(quad, cam);
  }
  renderer.setRenderTarget(null);
  await renderer.compileAsync(quad, cam);
  await renderer.compileAsync(scene, camera);
  renderer.setRenderTarget(prev);
  // textures: upload one per task so no single task runs long
  const texes = new Set<THREE.Texture>();
  scene.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    for (const mm of Array.isArray(m) ? m : m ? [m] : []) for (const v of Object.values(mm)) if (v instanceof THREE.Texture) texes.add(v);
  });
  for (const t of texes) { renderer.initTexture(t); await new Promise((r) => setTimeout(r, 0)); }
  geo.dispose();
}
