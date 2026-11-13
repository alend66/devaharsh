import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { L, FLOOR } from '../timeline.js';
import { store } from '../store.js';

const SW = 512;
const SH = 900;
const RES = 1.6;

function drawTechFest(g, t) {
  g.fillStyle = '#0b0b0c';
  g.fillRect(0, 0, SW, SH);
  g.font = '500 18px "JetBrains Mono"';
  g.fillStyle = 'rgba(255,255,255,.45)';
  g.fillText('TECH FEST  MS', 48, 70);
  g.fillText('● PHP/SQL', SW - 155, 70);

  const dx = 48,
    dy = 110,
    dw = SW - 96,
    dh = 520;
  g.fillStyle = '#121214';
  g.fillRect(dx, dy, dw, dh);
  g.strokeStyle = 'rgba(255,255,255,.1)';
  g.strokeRect(dx + 0.5, dy + 0.5, dw, dh);
  const beam = dy + ((t * 0.28) % 1) * dh;
  for (let i = 0; i < 15; i++) {
    const y = dy + 40 + i * 31;
    const w = (0.45 + ((i * 37) % 50) / 100) * (dw - 70);
    const active = i === 3 || i === 7 || i === 11;
    const lit = Math.abs(y - beam) < 26;
    g.fillStyle = active
      ? lit || (t * 2 + i) % 3 < 1.6
        ? 'rgba(255,255,255,.95)'
        : 'rgba(255,255,255,.35)'
      : lit
      ? 'rgba(255,255,255,.4)'
      : 'rgba(255,255,255,.12)';
    g.fillRect(dx + 35, y, w, 7);
    if (active) {
      g.fillStyle = 'rgba(255,255,255,.9)';
      g.beginPath();
      g.arc(dx + 20, y + 3.5, 4, 0, Math.PI * 2);
      g.fill();
    }
  }
  const grd = g.createLinearGradient(0, beam - 70, 0, beam);
  grd.addColorStop(0, 'rgba(255,255,255,0)');
  grd.addColorStop(1, 'rgba(255,255,255,.14)');
  g.fillStyle = grd;
  g.fillRect(dx, Math.max(dy, beam - 70), dw, Math.min(70, beam - dy));
  g.fillStyle = 'rgba(255,255,255,.9)';
  g.fillRect(dx, beam, dw, 2);

  const cx = SW / 2,
    cy = 760,
    r = 74;
  const v = 0.88 * (0.5 - 0.5 * Math.cos(Math.min(1, (t % 6) / 2.2) * Math.PI));
  g.lineWidth = 8;
  g.strokeStyle = 'rgba(255,255,255,.08)';
  g.beginPath();
  g.arc(cx, cy, r, 0, Math.PI * 2);
  g.stroke();
  g.strokeStyle = '#f2f2f4';
  g.lineCap = 'round';
  g.beginPath();
  g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + v * Math.PI * 2);
  g.stroke();
  g.fillStyle = '#fff';
  g.font = '300 48px "Inter Tight"';
  g.textAlign = 'center';
  g.fillText(`${Math.round(v * 100)}%`, cx, cy + 14);
  g.font = '500 13px "JetBrains Mono"';
  g.fillStyle = 'rgba(255,255,255,.45)';
  g.fillText('PARTICIPANT DB', cx, cy + 40);
  g.textAlign = 'left';
}

function drawHashRoot(g, t) {
  g.fillStyle = '#0b0b0c';
  g.fillRect(0, 0, SW, SH);
  g.font = '500 18px "JetBrains Mono"';
  g.fillStyle = 'rgba(255,255,255,.45)';
  g.fillText('HASHROOT OPS', 48, 70);
  g.fillText('EC2 · DNS', SW - 145, 70);
  const cols = 9,
    rows = 15,
    pad = 48,
    gap = 6;
  const cw = (SW - pad * 2 - gap * (cols - 1)) / cols;
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const w =
        (Math.sin(x * 0.7 + t * 0.9) +
          Math.cos(y * 0.45 - t * 0.7) +
          Math.sin((x + y) * 0.3 + t * 0.4)) /
        3;
      const v = Math.max(
        0,
        Math.min(1, 0.5 + w * 0.6 + Math.sin(x * 12.9 + y * 78.2) * 0.12)
      );
      g.fillStyle = `rgba(240,240,243,${0.05 + v * 0.85})`;
      g.fillRect(pad + x * (cw + gap), 110 + y * (cw + gap), cw, cw);
    }
  const by = 110 + rows * (cw + gap) + 30;
  const grd = g.createLinearGradient(pad, 0, SW - pad, 0);
  grd.addColorStop(0, 'rgba(255,255,255,.05)');
  grd.addColorStop(1, 'rgba(255,255,255,.95)');
  g.fillStyle = grd;
  g.fillRect(pad, by, SW - pad * 2, 6);
  g.font = '500 13px "JetBrains Mono"';
  g.fillStyle = 'rgba(255,255,255,.45)';
  g.fillText('SSL / BACKUP', pad, by + 30);
  g.textAlign = 'right';
  g.fillText('FIREWALL OK', SW - pad, by + 30);
  g.textAlign = 'left';
}

function drawPacelab(g, t) {
  g.fillStyle = '#0b0b0c';
  g.fillRect(0, 0, SW, SH);
  g.font = '500 18px "JetBrains Mono"';
  g.fillStyle = 'rgba(255,255,255,.45)';
  g.fillText('PACELAB  UI', 48, 70);
  const cx = SW / 2,
    cy = 420;
  const rings = [
    [190, 70, 0.4, 'HTML5'],
    [140, 120, -0.6, 'CSS3'],
    [215, 150, 1.2, 'JAVASCRIPT'],
  ];
  rings.forEach(([rx, ry, rot, label], i) => {
    g.save();
    g.translate(cx, cy);
    g.rotate(rot + t * 0.05 * (i % 2 ? -1 : 1));
    g.strokeStyle = 'rgba(255,255,255,.22)';
    g.lineWidth = 1.5;
    g.beginPath();
    g.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    g.stroke();
    const a = t * (0.6 + i * 0.25) + i * 2;
    const px = Math.cos(a) * rx,
      py = Math.sin(a) * ry;
    const gr = g.createRadialGradient(px, py, 0, px, py, 22);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(px - 22, py - 22, 44, 44);
    g.restore();
    g.font = '500 13px "JetBrains Mono"';
    g.fillStyle = 'rgba(255,255,255,.4)';
    g.fillText(label, [60, 330, 70][i], [190, 660, 640][i]);
  });
  const s = 1 + Math.sin(t * 2) * 0.12;
  g.save();
  g.translate(cx, cy);
  g.rotate(t * 0.3);
  g.scale(s, s);
  g.fillStyle = '#fff';
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 ? 9 : 34;
    const a = (i / 8) * Math.PI * 2;
    g[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r);
  }
  g.closePath();
  g.fill();
  g.restore();
  g.font = '300 44px "Inter Tight"';
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.fillText('Responsive UI', cx, 760);
  g.font = 'italic 400 40px "Instrument Serif"';
  g.fillStyle = 'rgba(255,255,255,.6)';
  g.fillText('front-end craft', cx, 808);
  g.textAlign = 'left';
}

const DRAW = [drawTechFest, drawHashRoot, drawPacelab];

function Monolith({ i, pos }) {
  const root = useRef();
  const body = useRef();
  const { canvas, tex } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = SW * RES;
    c.height = SH * RES;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return { canvas: c, tex: t };
  }, []);
  const ctx = useMemo(() => {
    const g = canvas.getContext('2d');
    g.setTransform(RES, 0, 0, RES, 0, 0);
    return g;
  }, [canvas]);
  const shot = useMemo(() => store.tl.shots[store.tl.index[`work${i}`]], [i]);
  const yaw = useMemo(
    () => Math.atan2(shot.pos.x - pos.x, shot.pos.z - pos.z),
    [shot, pos]
  );
  const beamMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uO: { value: 0.0 } },
        vertexShader:
          'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} ',
        fragmentShader:
          'varying vec2 vUv; uniform float uO; void main(){ float a = pow(vUv.y,2.2)*0.13*uO; a*= 0.6+0.4*sin(vUv.x*6.2832*3.0); gl_FragColor=vec4(vec3(1.0),a);} ',
      }),
    []
  );
  let frame = 0;

  useFrame((s) => {
    const d = Math.abs(s.camera.position.z - pos.z);
    root.current.visible = d < 50;
    if (!root.current.visible) return;
    const t = s.clock.elapsedTime;
    if (d < 32 && frame++ % 2 === 0) {
      DRAW[i](ctx, t);
      tex.needsUpdate = true;
    }
    body.current.position.y = Math.sin(t * 0.7 + i) * 0.06;
    body.current.rotation.y = yaw + Math.sin(t * 0.35 + i) * 0.05;
    beamMat.uniforms.uO.value = THREE.MathUtils.clamp(1.4 - d / 18, 0.15, 1);
  });

  const W = 2.5,
    H = 4.3,
    D = 0.22;
  return (
    <group ref={root} position={[pos.x, 0, pos.z]}>
      <group ref={body}>
        <mesh>
          <boxGeometry args={[W, H, D]} />
          <meshPhysicalMaterial
            color="#0d0d0f"
            metalness={0.9}
            roughness={0.22}
            clearcoat={1}
            clearcoatRoughness={0.15}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(W, H, D)]} />
          <lineBasicMaterial color="#cfcfd6" transparent opacity={0.55} />
        </lineSegments>
        <mesh position={[0, 0, D / 2 + 0.004]}>
          <planeGeometry args={[W - 0.16, H - 0.16]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
      <mesh position={[0, FLOOR + 6.5, 0]} material={beamMat}>
        <cylinderGeometry args={[0.35, 2.6, 13, 32, 1, true]} />
      </mesh>
      <spotLight
        position={[0, 7, 1.5]}
        angle={0.45}
        penumbra={0.9}
        intensity={60}
        distance={16}
        color="#e6e6ee"
      />
    </group>
  );
}

export default function Gallery() {
  return (
    <>
      {L.m.map((p, i) => (
        <Monolith key={i} i={i} pos={p} />
      ))}
    </>
  );
}

