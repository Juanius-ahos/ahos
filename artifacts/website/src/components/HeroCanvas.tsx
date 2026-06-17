import { useEffect, useRef } from "react";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0.5, 14);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setClearColor(0x000000, 0);

      const globe = new THREE.Group();
      scene.add(globe);

      const r = isMobile ? 4 : 5.5;
      const count = isMobile ? 300 : 550;
      const pts = new Float32Array(count * 3);
      const golden = (1 + Math.sqrt(5)) / 2;
      for (let i = 0; i < count; i++) {
        const theta = Math.acos(1 - 2 * (i + 0.5) / count);
        const phi = 2 * Math.PI * i / golden;
        pts[i * 3] = r * Math.sin(theta) * Math.cos(phi);
        pts[i * 3 + 1] = r * Math.cos(theta);
        pts[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
      }

      // Store original positions for vertex pulse
      const origDotPos = reducedMotion ? null : new Float32Array(pts);

      // Wireframe edges
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
        new THREE.LineBasicMaterial({ color: 0xff6a1a, transparent: true, opacity: isMobile ? 0.06 : 0.1 })
      ));

      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
      globe.add(new THREE.Points(
        dotGeo,
        new THREE.PointsMaterial({ color: 0xff6a1a, size: isMobile ? 0.05 : 0.065, transparent: true, opacity: 0.7, sizeAttenuation: true })
      ));

      if (!isMobile) {
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
      }

      const eqPts: number[] = [];
      for (let i = 0; i <= 48; i++) {
        const phi = (i / 48) * Math.PI * 2;
        eqPts.push(r * Math.cos(phi), 0, r * Math.sin(phi));
      }
      const eqGeo = new THREE.BufferGeometry();
      eqGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(eqPts), 3));
      globe.add(new THREE.Line(eqGeo, new THREE.LineBasicMaterial({ color: 0xff6a1a, transparent: true, opacity: isMobile ? 0.05 : 0.08 })));

      if (!isMobile) {
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
      }

      // mid particles
      const mdCount = isMobile ? 200 : 500;
      const mdPos = new Float32Array(mdCount * 3);
      for (let i = 0; i < mdCount; i++) {
        mdPos[i * 3] = (Math.random() - 0.5) * (isMobile ? 20 : 32);
        mdPos[i * 3 + 1] = (Math.random() - 0.5) * (isMobile ? 20 : 32);
        mdPos[i * 3 + 2] = (Math.random() - 0.5) * (isMobile ? 16 : 24) - 2;
      }
      const mdParticles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: 0xff6a1a, size: 0.02, transparent: true, opacity: isMobile ? 0.15 : 0.25, sizeAttenuation: true })
      );
      mdParticles.geometry.setAttribute("position", new THREE.BufferAttribute(mdPos, 3));
      scene.add(mdParticles);

      // near particles
      const nrCount = isMobile ? 150 : 400;
      const nrPos = new Float32Array(nrCount * 3);
      for (let i = 0; i < nrCount; i++) {
        nrPos[i * 3] = (Math.random() - 0.5) * (isMobile ? 22 : 36);
        nrPos[i * 3 + 1] = (Math.random() - 0.5) * (isMobile ? 22 : 36);
        nrPos[i * 3 + 2] = (Math.random() - 0.5) * 10 + 2;
      }
      const nrParticles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: 0xffdbb8, size: 0.01, transparent: true, opacity: isMobile ? 0.1 : 0.15, sizeAttenuation: true })
      );
      nrParticles.geometry.setAttribute("position", new THREE.BufferAttribute(nrPos, 3));
      scene.add(nrParticles);

      // accent particles
      const clCount = isMobile ? 80 : 200;
      const clPos = new Float32Array(clCount * 3);
      for (let i = 0; i < clCount; i++) {
        clPos[i * 3] = (Math.random() - 0.5) * (isMobile ? 18 : 30);
        clPos[i * 3 + 1] = (Math.random() - 0.5) * (isMobile ? 18 : 30);
        clPos[i * 3 + 2] = (Math.random() - 0.5) * 18;
      }
      const clParticles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: 0x4455cc, size: 0.015, transparent: true, opacity: isMobile ? 0.08 : 0.12, sizeAttenuation: true })
      );
      clParticles.geometry.setAttribute("position", new THREE.BufferAttribute(clPos, 3));
      scene.add(clParticles);

      // background particles
      const bgCount = isMobile ? 150 : 400;
      const bgPos = new Float32Array(bgCount * 3);
      for (let i = 0; i < bgCount; i++) {
        bgPos[i * 3] = (Math.random() - 0.5) * (isMobile ? 28 : 44);
        bgPos[i * 3 + 1] = (Math.random() - 0.5) * (isMobile ? 28 : 44);
        bgPos[i * 3 + 2] = (Math.random() - 0.5) * (isMobile ? 28 : 44) - 10;
      }
      const bgParticles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.008, transparent: true, opacity: isMobile ? 0.05 : 0.08, sizeAttenuation: true })
      );
      bgParticles.geometry.setAttribute("position", new THREE.BufferAttribute(bgPos, 3));
      scene.add(bgParticles);

      const cfg = isMobile
        ? { startX: 1.8, startY: 0, startScale: 0.7, path: [
            { rot: Math.PI * 1.5, scale: 0.6, posX: 1.2, posY: -0.3, d: 0.35 },
            { rot: Math.PI * 2.5, scale: 0.5, posX: 0.5, posY: -0.6, d: 0.25 },
            { rot: Math.PI * 3.5, scale: 0.4, posX: -0.3, posY: 0.8, d: 0.2 },
            { rot: Math.PI * 4, scale: 0.3, posX: -0.8, posY: -0.2, d: 0.2 },
          ] }
        : { startX: 8, startY: -0.3, startScale: 1, path: [
            { rot: Math.PI * 2, scale: 0.85, posX: 4, posY: -0.8, d: 0.35 },
            { rot: Math.PI * 4, scale: 0.65, posX: 0, posY: -1.2, d: 0.25 },
            { rot: Math.PI * 5.5, scale: 0.45, posX: -4, posY: 1.5, d: 0.2 },
            { rot: Math.PI * 6.5, scale: 0.3, posX: -7, posY: -0.5, d: 0.2 },
          ] };

      globe.position.set(cfg.startX, cfg.startY, 0);

      const state = { rot: 0, scale: cfg.startScale, posX: cfg.startX, posY: cfg.startY };

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
      cfg.path.forEach((p) => {
        tl.to(state, { rot: p.rot, scale: p.scale, posX: p.posX, posY: p.posY, ease: "power1.out", duration: p.d });
      });

      // Mouse parallax tilt — desktop only
      let mouseX = 0, mouseY = 0;
      let tiltX = 0, tiltY = 0;
      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      if (finePointer && !reducedMotion) {
        window.addEventListener("mousemove", onMouseMove);
      }

      let frame = 0;
      const animate = () => {
        globe.rotation.y = state.rot;
        globe.rotation.x = Math.sin(state.rot * 0.2) * 0.06;
        globe.position.x = state.posX;
        globe.position.y = state.posY;
        globe.scale.setScalar(state.scale);

        // Mouse tilt
        if (finePointer && !reducedMotion) {
          tiltX += (mouseY * 0.03 - tiltX) * 0.06;
          tiltY += (mouseX * 0.05 - tiltY) * 0.06;
          globe.rotation.x += tiltX;
          globe.rotation.z = tiltY;
        }

        // Vertex pulse — animate Y of each dot
        if (!reducedMotion && origDotPos) {
          const t = performance.now() * 0.001;
          const posAttr = dotGeo.getAttribute("position");
          for (let i = 0; i < count; i++) {
            const wave = Math.sin(t * 0.6 + i * 0.15) * 0.04;
            posAttr.array[i * 3 + 1] = origDotPos[i * 3 + 1] + wave;
          }
          posAttr.needsUpdate = true;
        }

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
        window.removeEventListener("mousemove", onMouseMove);
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
