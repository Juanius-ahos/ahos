import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0.5, 14);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setClearColor(0x000000, 0);

      const globe = new THREE.Group();
      globe.position.set(8, -0.5, 0);
      scene.add(globe);

      const r = 5.5;
      const count = 550;
      const pts = new Float32Array(count * 3);
      const golden = (1 + Math.sqrt(5)) / 2;
      for (let i = 0; i < count; i++) {
        const theta = Math.acos(1 - 2 * (i + 0.5) / count);
        const phi = 2 * Math.PI * i / golden;
        pts[i * 3] = r * Math.sin(theta) * Math.cos(phi);
        pts[i * 3 + 1] = r * Math.cos(theta);
        pts[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
      }

      const linePositions: number[] = [];
      const threshold = r * 0.22;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = pts[i * 3] - pts[j * 3];
          const dy = pts[i * 3 + 1] - pts[j * 3 + 1];
          const dz = pts[i * 3 + 2] - pts[j * 3 + 2];
          if (Math.sqrt(dx * dx + dy * dy + dz * dz) < threshold) {
            linePositions.push(pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2]);
            linePositions.push(pts[j * 3], pts[j * 3 + 1], pts[j * 3 + 2]);
          }
        }
      }

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
      globe.add(new THREE.LineSegments(
        lineGeo,
        new THREE.LineBasicMaterial({ color: 0xff6a1a, transparent: true, opacity: 0.1 })
      ));

      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
      globe.add(new THREE.Points(
        dotGeo,
        new THREE.PointsMaterial({ color: 0xff6a1a, size: 0.065, transparent: true, opacity: 0.7, sizeAttenuation: true })
      ));

      for (let lat = -60; lat <= 60; lat += 30) {
        const theta = (90 - lat) * Math.PI / 180;
        const ringPts: number[] = [];
        for (let i = 0; i <= 48; i++) {
          const phi = (i / 48) * Math.PI * 2;
          ringPts.push(r * Math.sin(theta) * Math.cos(phi), r * Math.cos(theta), r * Math.sin(theta) * Math.sin(phi));
        }
        const ringGeo = new THREE.BufferGeometry();
        ringGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(ringPts), 3));
        globe.add(new THREE.Line(ringGeo, new THREE.LineBasicMaterial({ color: 0xff6a1a, transparent: true, opacity: 0.05 })));
      }

      const eqPts: number[] = [];
      for (let i = 0; i <= 64; i++) {
        const phi = (i / 64) * Math.PI * 2;
        eqPts.push(r * Math.cos(phi), 0, r * Math.sin(phi));
      }
      const eqGeo = new THREE.BufferGeometry();
      eqGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(eqPts), 3));
      globe.add(new THREE.Line(eqGeo, new THREE.LineBasicMaterial({ color: 0xff6a1a, transparent: true, opacity: 0.08 })));

      const or1Pts: number[] = [];
      for (let i = 0; i <= 64; i++) {
        const phi = (i / 64) * Math.PI * 2;
        const rr = r * 1.5;
        or1Pts.push(rr * Math.cos(phi), rr * 0.25 * Math.sin(phi), rr * 0.6 * Math.sin(phi));
      }
      const or1Geo = new THREE.BufferGeometry();
      or1Geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(or1Pts), 3));
      const or1 = new THREE.Line(or1Geo, new THREE.LineBasicMaterial({ color: 0xff6a1a, transparent: true, opacity: 0.035 }));
      or1.rotation.x = 0.3;
      globe.add(or1);

      const or2Pts: number[] = [];
      for (let i = 0; i <= 64; i++) {
        const phi = (i / 64) * Math.PI * 2;
        const rr = r * 1.9;
        or2Pts.push(rr * 0.7 * Math.cos(phi), rr * Math.sin(phi), rr * 0.5 * Math.sin(phi));
      }
      const or2Geo = new THREE.BufferGeometry();
      or2Geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(or2Pts), 3));
      const or2 = new THREE.Line(or2Geo, new THREE.LineBasicMaterial({ color: 0x4455cc, transparent: true, opacity: 0.03 }));
      or2.rotation.y = 0.5;
      globe.add(or2);

      // mid particles (drift with scroll)
      const mdCount = 500;
      const mdPos = new Float32Array(mdCount * 3);
      for (let i = 0; i < mdCount; i++) {
        mdPos[i * 3] = (Math.random() - 0.5) * 32;
        mdPos[i * 3 + 1] = (Math.random() - 0.5) * 32;
        mdPos[i * 3 + 2] = (Math.random() - 0.5) * 24 - 4;
      }
      const mdParticles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: 0xff6a1a, size: 0.025, transparent: true, opacity: 0.25, sizeAttenuation: true })
      );
      mdParticles.geometry.setAttribute("position", new THREE.BufferAttribute(mdPos, 3));
      scene.add(mdParticles);

      // near particles (overlay dust — more dense, stays above text layer in z)
      const nrCount = 400;
      const nrPos = new Float32Array(nrCount * 3);
      for (let i = 0; i < nrCount; i++) {
        nrPos[i * 3] = (Math.random() - 0.5) * 36;
        nrPos[i * 3 + 1] = (Math.random() - 0.5) * 36;
        nrPos[i * 3 + 2] = (Math.random() - 0.5) * 12 + 3;
      }
      const nrParticles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: 0xffdbb8, size: 0.012, transparent: true, opacity: 0.15, sizeAttenuation: true })
      );
      nrParticles.geometry.setAttribute("position", new THREE.BufferAttribute(nrPos, 3));
      scene.add(nrParticles);

      // cool-tinted accent particles
      const clCount = 200;
      const clPos = new Float32Array(clCount * 3);
      for (let i = 0; i < clCount; i++) {
        clPos[i * 3] = (Math.random() - 0.5) * 30;
        clPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
        clPos[i * 3 + 2] = (Math.random() - 0.5) * 24;
      }
      const clParticles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: 0x4455cc, size: 0.02, transparent: true, opacity: 0.12, sizeAttenuation: true })
      );
      clParticles.geometry.setAttribute("position", new THREE.BufferAttribute(clPos, 3));
      scene.add(clParticles);

      // background particles (deep field, parallax)
      const bgCount = 400;
      const bgPos = new Float32Array(bgCount * 3);
      for (let i = 0; i < bgCount; i++) {
        bgPos[i * 3] = (Math.random() - 0.5) * 44;
        bgPos[i * 3 + 1] = (Math.random() - 0.5) * 44;
        bgPos[i * 3 + 2] = (Math.random() - 0.5) * 44 - 15;
      }
      const bgParticles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.01, transparent: true, opacity: 0.08, sizeAttenuation: true })
      );
      bgParticles.geometry.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
      scene.add(bgParticles);

      const state = { rot: 0, scale: 1, posX: 8, posY: -0.3 };

      const gsap = (await import("gsap")).default;
      const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
      tl.to(state, { rot: Math.PI * 2, scale: 0.85, posX: 4, posY: -0.8, ease: "power1.out", duration: 0.35 })
        .to(state, { rot: Math.PI * 4, scale: 0.65, posX: 0, posY: -1.2, ease: "power1.inOut", duration: 0.25 })
        .to(state, { rot: Math.PI * 5.5, scale: 0.45, posX: -4, posY: 1.5, ease: "power1.out", duration: 0.2 })
        .to(state, { rot: Math.PI * 6.5, scale: 0.3, posX: -7, posY: -0.5, ease: "power1.in", duration: 0.2 });

      let frame = 0;
      const animate = () => {
        globe.rotation.y = state.rot;
        globe.rotation.x = Math.sin(state.rot * 0.2) * 0.06;
        globe.position.x = state.posX;
        globe.position.y = state.posY;
        globe.scale.setScalar(state.scale);
        mdParticles.rotation.y = state.rot * 0.25;
        mdParticles.rotation.x = Math.sin(state.rot * 0.25) * 0.04;
        nrParticles.rotation.y = state.rot * 0.35;
        nrParticles.rotation.x = Math.sin(state.rot * 0.3) * 0.05;
        clParticles.rotation.y = state.rot * 0.2;
        clParticles.rotation.x = Math.sin(state.rot * 0.2) * 0.03;
        bgParticles.rotation.y = state.rot * 0.08;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);

      const onResize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", onResize);
        const st = tl.scrollTrigger;
        if (st) st.kill();
        tl.kill();
        renderer.dispose();
      };
    })();

    return () => cleanup?.();
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
