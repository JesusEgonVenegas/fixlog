"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";

export function LivingNebula() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || resolvedTheme !== "dark") return;

    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(random(i),               random(i + vec2(1.0, 0.0)), u.x),
          mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 6; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv    = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec2 mouse = (iMouse           - 0.5 * iResolution.xy) / iResolution.y;
        float t    = iTime * 0.08;

        // Mouse warp
        float md = length(uv - mouse);
        vec2 warp = normalize(uv - mouse) / (md * 50.0);
        uv += warp * smoothstep(0.35, 0.0, md);

        // Slow rotating flow
        float angle = t * 0.25;
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        vec2 p = rot * uv;

        float c1 = fbm(p * 2.0 + vec2(t, -t));
        float c2 = fbm(p * 3.5 - vec2(-t * 0.7, t * 1.3));

        // FixLog mint palette adapted for GLSL sRGB
        // deepSpace  ≈ oklch(0.12 0.01 240)
        // mintGlow   ≈ oklch(0.62 0.14 168) — slightly dimmed for dark bg
        // tealAccent ≈ oklch(0.45 0.10 200) — deeper teal
        vec3 deepSpace  = vec3(0.04, 0.05, 0.09);
        vec3 mintGlow   = vec3(0.18, 0.68, 0.55);
        vec3 tealAccent = vec3(0.06, 0.38, 0.52);

        vec3 color = deepSpace;
        color = mix(color, mintGlow,   smoothstep(0.38, 0.62, c1));
        color = mix(color, tealAccent, smoothstep(0.48, 0.70, c2) * 0.6);

        // Subtle vignette to keep edges dark
        float vignette = 1.0 - smoothstep(0.5, 1.4, length(uv * 0.9));
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const uniforms = {
      iTime:       { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse:      { value: new THREE.Vector2(-100, -100) },
    };

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const mesh     = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);
    onResize();

    const onMouseMove = (e: MouseEvent) => {
      uniforms.iMouse.value.set(e.clientX, container.clientHeight - e.clientY);
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMouseMove);

    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.setAnimationLoop(null);
      const canvas = renderer.domElement;
      if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, [mounted, resolvedTheme]);

  if (!mounted || resolvedTheme !== "dark") return null;

  return (
    <>
      {/* WebGL canvas container */}
      <div
        ref={containerRef}
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          width:         "100vw",
          height:        "100vh",
          zIndex:        -1,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      {/* Mint cursor aura */}
      <div
        style={{
          position:      "fixed",
          top:           mousePos.y - 12,
          left:          mousePos.x - 12,
          width:         "24px",
          height:        "24px",
          borderRadius:  "50%",
          background:    "oklch(0.78 0.14 168 / 0.35)",
          boxShadow:     "0 0 12px oklch(0.78 0.14 168 / 0.2)",
          pointerEvents: "none",
          zIndex:        9999,
        }}
        aria-hidden="true"
      />
    </>
  );
}
