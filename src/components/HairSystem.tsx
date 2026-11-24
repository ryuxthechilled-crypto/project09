import React, { useMemo } from 'react';
import * as THREE from 'three';

import type { HairStyle } from '../characters/look';
export type { HairStyle };

type V3 = [number, number, number];

/**
 * Generates a procedural hair-fiber texture (color map + bump map)
 * so every lock and crown has fine longitudinal hair strands and natural sheen.
 */
function createHairTextures(baseHex: string, highlightHex: string, ombreHex?: string) {
  const w = 256;
  const h = 512;

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = w;
  colorCanvas.height = h;
  const ctx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = w;
  bumpCanvas.height = h;
  const bctx = bumpCanvas.getContext('2d')!;

  const baseColor = new THREE.Color(baseHex);
  const hlColor = new THREE.Color(highlightHex);
  const darkColor = baseColor.clone().multiplyScalar(0.62);
  const rootColor = baseColor.clone().multiplyScalar(0.48);
  const tipColor = ombreHex ? new THREE.Color(ombreHex) : hlColor;

  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0.0, `#${rootColor.getHexString()}`);
  bgGrad.addColorStop(0.18, `#${baseColor.getHexString()}`);
  bgGrad.addColorStop(0.68, `#${baseColor.getHexString()}`);
  bgGrad.addColorStop(1.0, `#${(ombreHex ? tipColor : baseColor.clone().lerp(hlColor, 0.35)).getHexString()}`);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, w, h);

  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 220; i++) {
    const x = rand() * w;
    const width = 1.0 + rand() * 2.8;
    const isHighlight = rand() > 0.58;
    const isShadow = !isHighlight && rand() > 0.4;

    const strandGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (isHighlight) {
      strandGrad.addColorStop(0.0, `rgba(0,0,0,0.18)`);
      strandGrad.addColorStop(0.25, `#${hlColor.getHexString()}`);
      strandGrad.addColorStop(0.75, `#${hlColor.getHexString()}`);
      strandGrad.addColorStop(1.0, `#${tipColor.getHexString()}`);
      ctx.globalAlpha = 0.24 + rand() * 0.25;
    } else if (isShadow) {
      strandGrad.addColorStop(0.0, `#${rootColor.getHexString()}`);
      strandGrad.addColorStop(0.8, `#${darkColor.getHexString()}`);
      strandGrad.addColorStop(1.0, `#${(ombreHex ? tipColor.clone().multiplyScalar(0.8) : darkColor).getHexString()}`);
      ctx.globalAlpha = 0.25 + rand() * 0.25;
    } else {
      continue;
    }

    ctx.strokeStyle = strandGrad;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    const waveAmp = (rand() - 0.5) * 6;
    ctx.bezierCurveTo(x + waveAmp, h * 0.33, x - waveAmp, h * 0.66, x + (rand() - 0.5) * 3, h);
    ctx.stroke();

    bctx.globalAlpha = 0.35;
    bctx.strokeStyle = isHighlight ? '#D8D8D8' : '#303030';
    bctx.lineWidth = width;
    bctx.beginPath();
    bctx.moveTo(x, 0);
    bctx.bezierCurveTo(x + waveAmp, h * 0.33, x - waveAmp, h * 0.66, x + (rand() - 0.5) * 3, h);
    bctx.stroke();
  }

  ctx.globalAlpha = 0.16;
  const sheenGrad = ctx.createLinearGradient(0, h * 0.18, 0, h * 0.48);
  sheenGrad.addColorStop(0, 'rgba(255,255,255,0)');
  sheenGrad.addColorStop(0.5, `#${hlColor.clone().lerp(new THREE.Color('#FFFFFF'), 0.45).getHexString()}`);
  sheenGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheenGrad;
  ctx.fillRect(0, h * 0.18, w, h * 0.3);

  const map = new THREE.CanvasTexture(colorCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  map.needsUpdate = true;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;
  bumpMap.needsUpdate = true;

  return { map, bumpMap };
}

function buildTaperedLockGeometry(
  pts: V3[],
  width = 0.22,
  depth = 0.11,
  segments = 24,
  radialSegments = 10
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  const frames = curve.computeFrenetFrames(segments, false);

  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pt = curve.getPointAt(t);
    const N = frames.normals[i];
    const B = frames.binormals[i];

    let profile = 1.0;
    if (t < 0.22) {
      profile = 0.72 + (t / 0.22) * 0.28;
    } else {
      const u = (t - 0.22) / 0.78;
      profile = Math.max(0.02, Math.pow(1.0 - Math.pow(u, 1.35), 0.95));
    }

    const w = width * profile;
    const d = depth * profile;

    for (let j = 0; j <= radialSegments; j++) {
      const uRad = j / radialSegments;
      const theta = uRad * Math.PI * 2;
      const flute = 1.0 + 0.06 * Math.cos(theta * 3);
      const lx = Math.cos(theta) * w * flute;
      const ly = Math.sin(theta) * d * flute;

      const vx = pt.x + B.x * lx + N.x * ly;
      const vy = pt.y + B.y * lx + N.y * ly;
      const vz = pt.z + B.z * lx + N.z * ly;
      positions.push(vx, vy, vz);

      const nx = B.x * Math.cos(theta) + N.x * Math.sin(theta);
      const ny = B.y * Math.cos(theta) + N.y * Math.sin(theta);
      const nz = B.z * Math.cos(theta) + N.z * Math.sin(theta);
      const len = Math.hypot(nx, ny, nz) || 1;
      normals.push(nx / len, ny / len, nz / len);

      uvs.push(uRad, 1.0 - t);
    }
  }

  const ringStride = radialSegments + 1;
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * ringStride + j;
      const b = (i + 1) * ringStride + j;
      const c = (i + 1) * ringStride + (j + 1);
      const d = i * ringStride + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

const TaperedLock: React.FC<{
  pts: V3[];
  width?: number;
  depth?: number;
  material: THREE.Material;
}> = ({ pts, width = 0.22, depth = 0.11, material }) => {
  const key = JSON.stringify(pts) + width + depth;
  const geo = useMemo(() => buildTaperedLockGeometry(pts, width, depth), [key]);
  return <mesh geometry={geo} material={material} castShadow receiveShadow />;
};

/**
 * Full-coverage sculpted hair crown that hugs the top, temples, sides, and back
 * while keeping the front face (+Z) completely open so eyes & brows are 100% visible.
 * Note: In Three.js CylinderGeometry, theta=0 is +Z (front) and theta=PI is -Z (back).
 * So thetaStart = PI * 0.45 and thetaLength = PI * 1.10 covers ONLY the sides and back!
 */
const SculptedCrown: React.FC<{
  material: THREE.Material;
  partOffset?: number;
  backLength?: number;
  volume?: number;
}> = ({ material, partOffset = 0, backLength = 0.65, volume = 1.0 }) => {
  return (
    <group>
      {/* Upper skull cap tilted slightly toward the back so front hairline stays at y=+0.34 */}
      <mesh
        position={[0, 0.43, -0.05]}
        rotation={[-0.22, 0, 0]}
        scale={[1.06 * volume, 0.78 * volume, 1.08 * volume]}
        material={material}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.68, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
      </mesh>

      {/* Left & Right parted crown lobes */}
      <mesh
        position={[-0.22 + partOffset * 0.3, 0.54, -0.02]}
        rotation={[-0.1, 0, 0.18]}
        scale={[0.82 * volume, 0.46 * volume, 0.92 * volume]}
        material={material}
        castShadow
      >
        <sphereGeometry args={[0.56, 20, 14]} />
      </mesh>
      <mesh
        position={[0.22 + partOffset * 0.3, 0.54, -0.02]}
        rotation={[-0.1, 0, -0.18]}
        scale={[0.82 * volume, 0.46 * volume, 0.92 * volume]}
        material={material}
        castShadow
      >
        <sphereGeometry args={[0.56, 20, 14]} />
      </mesh>

      {/* Side & Back wrap shell (theta from 0.45*PI through PI (back) to 1.55*PI) - NEVER covers +Z face! */}
      <mesh
        position={[0, 0.14, -0.02]}
        material={material}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.69, 0.67, 0.74, 28, 1, false, Math.PI * 0.45, Math.PI * 1.10]} />
      </mesh>

      {/* Lower nape volume at the back (-Z) */}
      {backLength > 0 && (
        <mesh
          position={[0, 0.18 - backLength * 0.5, -0.50]}
          scale={[1.0, 1.0, 0.55]}
          material={material}
          castShadow
        >
          <cylinderGeometry args={[0.65, 0.56, backLength, 20]} />
        </mesh>
      )}
    </group>
  );
};

export const HairSystem: React.FC<{
  style: HairStyle;
  color: string;
  highlight?: string;
  ombre?: string;
}> = ({ style, color, highlight, ombre }) => {
  const hl = highlight ?? color;

  const crownMat = useMemo(() => {
    const { map, bumpMap } = createHairTextures(color, hl, undefined);
    return new THREE.MeshStandardMaterial({
      map,
      bumpMap,
      bumpScale: 0.025,
      roughness: 0.46,
      metalness: 0.06,
      side: THREE.DoubleSide,
    });
  }, [color, hl]);

  const hairMat = useMemo(() => {
    const { map, bumpMap } = createHairTextures(color, hl, ombre);
    return new THREE.MeshStandardMaterial({
      map,
      bumpMap,
      bumpScale: 0.025,
      roughness: 0.46,
      metalness: 0.06,
      side: THREE.DoubleSide,
    });
  }, [color, hl, ombre]);

  // ---------------------------------------------------------------------------
  // 1. 'bacon' or 'messyFringe': Thick Parted Curtain / Anime Boy Hair
  //    Parted bangs frame the forehead & temples so eyes and brows stay clear!
  // ---------------------------------------------------------------------------
  if (style === 'bacon' || style === 'messyFringe') {
    const bangs: { pts: V3[]; w: number; d: number }[] = [
      // Left curtain sweep framing left brow/temple
      { w: 0.22, d: 0.10, pts: [[-0.04, 0.66, 0.18], [-0.18, 0.60, 0.54], [-0.36, 0.44, 0.66], [-0.48, 0.22, 0.60]] },
      { w: 0.24, d: 0.11, pts: [[-0.10, 0.65, 0.14], [-0.32, 0.56, 0.50], [-0.52, 0.36, 0.60], [-0.62, 0.08, 0.52]] },
      { w: 0.24, d: 0.11, pts: [[-0.18, 0.63, 0.08], [-0.46, 0.50, 0.42], [-0.64, 0.24, 0.48], [-0.68, -0.10, 0.40]] },
      // Center high forehead wisps (staying above y=0.30 so eyes/brows are open)
      { w: 0.15, d: 0.08, pts: [[-0.02, 0.65, 0.22], [-0.08, 0.56, 0.58], [-0.12, 0.42, 0.67], [-0.07, 0.30, 0.65]] },
      { w: 0.15, d: 0.08, pts: [[0.02, 0.65, 0.22], [0.08, 0.56, 0.58], [0.12, 0.42, 0.67], [0.07, 0.30, 0.65]] },
      // Right curtain sweep framing right brow/temple
      { w: 0.22, d: 0.10, pts: [[0.04, 0.66, 0.18], [0.18, 0.60, 0.54], [0.36, 0.44, 0.66], [0.48, 0.22, 0.60]] },
      { w: 0.24, d: 0.11, pts: [[0.10, 0.65, 0.14], [0.32, 0.56, 0.50], [0.52, 0.36, 0.60], [0.62, 0.08, 0.52]] },
      { w: 0.24, d: 0.11, pts: [[0.18, 0.63, 0.08], [0.46, 0.50, 0.42], [0.64, 0.24, 0.48], [0.68, -0.10, 0.40]] },
    ];

    const sideLocks: { pts: V3[]; w: number; d: number }[] = [-1, 1].flatMap((s) => [
      {
        w: 0.25,
        d: 0.11,
        pts: [
          [s * 0.35, 0.58, 0.05],
          [s * 0.64, 0.42, 0.24],
          [s * 0.70, 0.10, 0.24],
          [s * 0.66, -0.26, 0.18],
        ],
      },
      {
        w: 0.26,
        d: 0.12,
        pts: [
          [s * 0.45, 0.54, -0.15],
          [s * 0.69, 0.34, -0.02],
          [s * 0.72, 0.02, 0.02],
          [s * 0.67, -0.32, -0.02],
        ],
      },
      {
        w: 0.19,
        d: 0.09,
        pts: [
          [s * 0.42, 0.56, 0.0],
          [s * 0.70, 0.38, 0.10],
          [s * 0.78, 0.12, 0.06],
          [s * 0.80, -0.12, 0.0],
        ],
      },
    ]);

    const backLocks: { pts: V3[]; w: number; d: number }[] = [
      [-0.42, 0.08],
      [-0.21, -0.05],
      [0.0, 0.06],
      [0.21, -0.05],
      [0.42, 0.08],
    ].map(([x, flare]) => ({
      w: 0.28,
      d: 0.12,
      pts: [
        [x * 0.7, 0.56, -0.25],
        [x, 0.36, -0.64],
        [x * 1.05, 0.04, -0.70],
        [x * 1.08, -0.34, -0.66 + flare],
      ],
    }));

    return (
      <group>
        <SculptedCrown material={hairMat} backLength={0.62} volume={1.03} />
        {bangs.map((b, i) => (
          <TaperedLock key={`f${i}`} pts={b.pts} width={b.w} depth={b.d} material={hairMat} />
        ))}
        {sideLocks.map((b, i) => (
          <TaperedLock key={`s${i}`} pts={b.pts} width={b.w} depth={b.d} material={hairMat} />
        ))}
        {backLocks.map((b, i) => (
          <TaperedLock key={`bk${i}`} pts={b.pts} width={b.w} depth={b.d} material={hairMat} />
        ))}
      </group>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. 'wavyLong': Flowing Long Wavy Hair with Face-Framing Curtain Bangs
  // ---------------------------------------------------------------------------
  if (style === 'wavyLong') {
    const bangs: V3[][] = [-1, 1].flatMap((s) => [
      [
        [s * 0.04, 0.66, 0.16],
        [s * 0.24, 0.58, 0.52],
        [s * 0.46, 0.40, 0.62],
        [s * 0.58, 0.16, 0.52],
      ],
      [
        [s * 0.10, 0.64, 0.10],
        [s * 0.38, 0.54, 0.44],
        [s * 0.60, 0.28, 0.52],
        [s * 0.66, -0.06, 0.40],
      ],
      [
        [s * 0.18, 0.62, 0.02],
        [s * 0.52, 0.46, 0.32],
        [s * 0.68, 0.16, 0.36],
        [s * 0.72, -0.25, 0.28],
      ],
    ]);

    const shoulderLocks: V3[][] = [-1, 1].flatMap((s) => [
      [
        [s * 0.54, 0.45, 0.08],
        [s * 0.70, 0.10, 0.20],
        [s * 0.66, -0.35, 0.26],
        [s * 0.72, -0.82, 0.22],
        [s * 0.64, -1.25, 0.26],
      ],
      [
        [s * 0.58, 0.42, -0.08],
        [s * 0.74, 0.04, 0.02],
        [s * 0.70, -0.45, 0.06],
        [s * 0.76, -0.92, 0.0],
        [s * 0.68, -1.35, 0.06],
      ],
    ]);

    const backWaves: V3[][] = [-0.56, -0.42, -0.28, -0.14, 0, 0.14, 0.28, 0.42, 0.56].map((x, idx) => {
      const phase = (idx % 2 === 0 ? 1 : -1) * 0.07;
      return [
        [x * 0.85, 0.50, -0.28],
        [x * 1.02, 0.15, -0.62],
        [x * 1.08 + phase, -0.35, -0.68],
        [x * 1.05 - phase, -0.88, -0.64],
        [x * 1.0 + phase * 0.6, -1.42 - (idx % 3) * 0.08, -0.58],
      ];
    });

    return (
      <group>
        <SculptedCrown material={crownMat} backLength={1.35} volume={1.04} />
        {bangs.map((pts, i) => (
          <TaperedLock key={`b${i}`} pts={pts} width={0.23} depth={0.10} material={crownMat} />
        ))}
        {shoulderLocks.map((pts, i) => (
          <TaperedLock key={`sh${i}`} pts={pts} width={0.26} depth={0.13} material={hairMat} />
        ))}
        {backWaves.map((pts, i) => (
          <TaperedLock key={`bw${i}`} pts={pts} width={0.29} depth={0.14} material={hairMat} />
        ))}
      </group>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. 'ponytail' or 'bun': Sleek Swept Crown + Face-Framing Curtain Bangs + High Ponytail/Bun
  // ---------------------------------------------------------------------------
  if (style === 'ponytail' || style === 'bun') {
    const bangs: V3[][] = [-1, 1].flatMap((s) => [
      [
        [s * 0.04, 0.65, 0.16],
        [s * 0.26, 0.58, 0.50],
        [s * 0.48, 0.38, 0.60],
        [s * 0.58, 0.12, 0.50],
      ],
      [
        [s * 0.14, 0.62, 0.08],
        [s * 0.46, 0.50, 0.38],
        [s * 0.64, 0.22, 0.42],
        [s * 0.68, -0.18, 0.32],
      ],
      [
        [s * 0.38, 0.52, -0.05],
        [s * 0.68, 0.32, 0.14],
        [s * 0.70, -0.02, 0.16],
        [s * 0.65, -0.32, 0.10],
      ],
    ]);

    const tailLocks: V3[][] = [-0.22, -0.11, 0, 0.11, 0.22].map((ox, i) => [
      [ox * 0.5, 0.62, -0.48],
      [ox * 0.9, 0.74 + (i % 2) * 0.05, -0.78],
      [ox * 1.2, 0.42, -1.02],
      [ox * 1.3, -0.12, -1.06],
      [ox * 1.1, -0.75 - (i % 2) * 0.12, -0.92],
    ]);

    return (
      <group>
        <SculptedCrown material={hairMat} backLength={0.45} volume={1.02} />
        {bangs.map((pts, i) => (
          <TaperedLock key={`pb${i}`} pts={pts} width={0.22} depth={0.10} material={hairMat} />
        ))}
        <mesh position={[0, 0.62, -0.52]} rotation={[0.45, 0, 0]} castShadow>
          <torusGeometry args={[0.20, 0.06, 10, 20]} />
          <meshStandardMaterial color="#1E293B" roughness={0.5} />
        </mesh>
        {style === 'bun' ? (
          <group position={[0, 0.82, -0.56]}>
            <mesh material={hairMat} scale={[1.1, 0.95, 1.1]} castShadow>
              <sphereGeometry args={[0.38, 22, 18]} />
            </mesh>
          </group>
        ) : (
          tailLocks.map((pts, i) => (
            <TaperedLock key={`tl${i}`} pts={pts} width={0.26} depth={0.13} material={hairMat} />
          ))
        )}
      </group>
    );
  }

  // ---------------------------------------------------------------------------
  // 4. 'sidePart' / 'slickBack' / 'fluffySwept': Swept Side-Parted Fringe
  //    Sweeps across upper forehead (y=0.28..0.64) leaving eyes & brows visible!
  // ---------------------------------------------------------------------------
  if (style === 'sidePart' || style === 'fluffySwept') {
    const sweptBangs: V3[][] = [0, 1, 2, 3, 4, 5].map((i) => {
      const startX = -0.36 + i * 0.11;
      const endX = 0.08 + i * 0.10;
      return [
        [startX, 0.66, 0.08],
        [(startX + endX) * 0.5, 0.62, 0.48],
        [endX, 0.48 - (i % 2) * 0.03, 0.65],
        [endX + 0.12, 0.30 - (i % 3) * 0.03, 0.61],
      ];
    });

    const leftPartLocks: V3[][] = [0, 1, 2].map((i) => [
      [-0.36 - i * 0.06, 0.62, 0.12 - i * 0.08],
      [-0.56 - i * 0.04, 0.46, 0.38 - i * 0.10],
      [-0.66, 0.22 - i * 0.06, 0.32 - i * 0.10],
      [-0.64, -0.10 - i * 0.05, 0.20 - i * 0.08],
    ]);

    const rightTempleLock: V3[] = [
      [0.42, 0.56, 0.06],
      [0.64, 0.38, 0.28],
      [0.68, 0.10, 0.26],
      [0.64, -0.18, 0.18],
    ];

    const sideAndBack: V3[][] = [-0.52, -0.26, 0, 0.26, 0.52].map((x) => [
      [x * 0.8, 0.54, -0.22],
      [x * 1.02, 0.30, -0.62],
      [x * 1.04, -0.02, -0.68],
      [x, -0.28, -0.62],
    ]);

    return (
      <group>
        <SculptedCrown material={hairMat} partOffset={-0.35} backLength={0.55} volume={1.03} />
        {sweptBangs.map((pts, i) => (
          <TaperedLock key={`sb${i}`} pts={pts} width={0.23} depth={0.10} material={hairMat} />
        ))}
        {leftPartLocks.map((pts, i) => (
          <TaperedLock key={`lp${i}`} pts={pts} width={0.22} depth={0.10} material={hairMat} />
        ))}
        <TaperedLock pts={rightTempleLock} width={0.23} depth={0.10} material={hairMat} />
        {sideAndBack.map((pts, i) => (
          <TaperedLock key={`bk${i}`} pts={pts} width={0.27} depth={0.12} material={hairMat} />
        ))}
      </group>
    );
  }

  // ---------------------------------------------------------------------------
  // 5. 'pigtails': Space Buns / High Twin Tails with Curtain Bangs
  // ---------------------------------------------------------------------------
  if (style === 'pigtails') {
    return (
      <group>
        <SculptedCrown material={hairMat} backLength={0.52} volume={1.02} />
        {[-1, 1].map((s) => (
          <group key={s}>
            <TaperedLock
              material={hairMat}
              width={0.22}
              depth={0.10}
              pts={[
                [s * 0.04, 0.65, 0.16],
                [s * 0.26, 0.58, 0.50],
                [s * 0.48, 0.38, 0.60],
                [s * 0.58, 0.12, 0.50],
              ]}
            />
            <TaperedLock
              material={hairMat}
              width={0.23}
              depth={0.10}
              pts={[
                [s * 0.22, 0.60, 0.06],
                [s * 0.56, 0.42, 0.34],
                [s * 0.68, 0.12, 0.34],
                [s * 0.66, -0.24, 0.24],
              ]}
            />
            <mesh position={[s * 0.52, 0.78, -0.18]} material={hairMat} castShadow>
              <sphereGeometry args={[0.30, 18, 16]} />
            </mesh>
            <TaperedLock
              material={hairMat}
              width={0.25}
              depth={0.12}
              pts={[
                [s * 0.55, 0.72, -0.22],
                [s * 0.82, 0.45, -0.26],
                [s * 0.88, 0.0, -0.22],
                [s * 0.78, -0.65, -0.15],
              ]}
            />
          </group>
        ))}
      </group>
    );
  }

  // ---------------------------------------------------------------------------
  // 6. 'grandpa': Balding Horseshoe Side/Back Fringe
  // ---------------------------------------------------------------------------
  if (style === 'grandpa') {
    const horseshoeLocks: V3[][] = [-1, 1].flatMap((s) => [
      [
        [s * 0.52, 0.42, 0.28],
        [s * 0.66, 0.32, 0.18],
        [s * 0.69, 0.06, 0.12],
        [s * 0.64, -0.18, 0.08],
      ],
      [
        [s * 0.58, 0.38, 0.02],
        [s * 0.70, 0.22, -0.16],
        [s * 0.68, -0.08, -0.22],
        [s * 0.62, -0.28, -0.24],
      ],
    ]);

    return (
      <group>
        <mesh position={[0, 0.12, -0.02]} material={hairMat} castShadow>
          <cylinderGeometry args={[0.685, 0.67, 0.48, 24, 1, false, Math.PI * 0.45, Math.PI * 1.10]} />
        </mesh>
        {horseshoeLocks.map((pts, i) => (
          <TaperedLock key={i} pts={pts} width={0.22} depth={0.10} material={hairMat} />
        ))}
      </group>
    );
  }

  // ---------------------------------------------------------------------------
  // 'none': bald
  // ---------------------------------------------------------------------------
  if (style === 'none') return null;

  // ---------------------------------------------------------------------------
  // 'buzz': close-cropped cut hugging the skull, hairline high on the forehead
  // ---------------------------------------------------------------------------
  if (style === 'buzz') {
    return (
      <group>
        <mesh position={[0, 0.38, -0.02]} scale={[1, 0.42, 1]} material={crownMat} castShadow>
          <sphereGeometry args={[0.655, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        </mesh>
        <mesh position={[0, 0.16, -0.02]} material={crownMat} castShadow>
          <cylinderGeometry args={[0.655, 0.645, 0.44, 28, 1, true, Math.PI * 0.42, Math.PI * 1.16]} />
        </mesh>
      </group>
    );
  }

  // ---------------------------------------------------------------------------
  // 'slickBack': no bangs — every lock combed from the hairline over the top to the nape
  // ---------------------------------------------------------------------------
  if (style === 'slickBack') {
    const combed: V3[][] = [-0.48, -0.32, -0.16, 0, 0.16, 0.32, 0.48].map((x, i) => [
      [x * 0.92, 0.6, 0.56],
      [x * 1.0, 0.84 + (i % 2) * 0.02, 0.34],
      [x * 1.02, 0.93, -0.06],
      [x * 1.04, 0.84, -0.5],
      [x * 1.0, 0.4, -0.74],
    ]);
    const sides: V3[][] = [-1, 1].flatMap((s) => [
      [
        [s * 0.58, 0.46, 0.3],
        [s * 0.7, 0.4, -0.05],
        [s * 0.68, 0.22, -0.45],
        [s * 0.55, 0.0, -0.62],
      ],
    ]);
    return (
      <group>
        <SculptedCrown material={hairMat} backLength={0.42} volume={1.0} />
        {combed.map((pts, i) => (
          <TaperedLock key={`c${i}`} pts={pts} width={0.24} depth={0.08} material={hairMat} />
        ))}
        {sides.map((pts, i) => (
          <TaperedLock key={`s${i}`} pts={pts} width={0.24} depth={0.1} material={hairMat} />
        ))}
      </group>
    );
  }

  // ---------------------------------------------------------------------------
  // 'bob': chin-length straight cut with a blunt fringe above the brows
  // ---------------------------------------------------------------------------
  if (style === 'bob') {
    const fringe: V3[][] = [-0.4, -0.27, -0.13, 0, 0.13, 0.27, 0.4].map((x) => [
      [x * 0.6, 0.68, 0.12],
      [x * 0.9, 0.62, 0.52],
      [x * 1.0, 0.46, 0.67],
      [x * 1.0, 0.31, 0.68],
    ]);
    const curtain: V3[][] = [-1, 1].flatMap((s) => [
      [
        [s * 0.4, 0.62, 0.3],
        [s * 0.66, 0.42, 0.42],
        [s * 0.74, 0.0, 0.36],
        [s * 0.7, -0.42, 0.34],
      ],
      [
        [s * 0.5, 0.58, 0.05],
        [s * 0.74, 0.36, 0.12],
        [s * 0.8, -0.05, 0.08],
        [s * 0.76, -0.46, 0.08],
      ],
      [
        [s * 0.5, 0.58, -0.25],
        [s * 0.74, 0.34, -0.2],
        [s * 0.8, -0.05, -0.22],
        [s * 0.76, -0.46, -0.2],
      ],
    ]);
    const back: V3[][] = [-0.5, -0.25, 0, 0.25, 0.5].map((x) => [
      [x * 0.8, 0.56, -0.25],
      [x * 1.02, 0.32, -0.66],
      [x * 1.06, -0.05, -0.74],
      [x * 1.02, -0.46, -0.7],
    ]);
    return (
      <group>
        <SculptedCrown material={hairMat} backLength={0.8} volume={1.04} />
        {fringe.map((pts, i) => (
          <TaperedLock key={`f${i}`} pts={pts} width={0.2} depth={0.09} material={hairMat} />
        ))}
        {curtain.map((pts, i) => (
          <TaperedLock key={`c${i}`} pts={pts} width={0.27} depth={0.13} material={hairMat} />
        ))}
        {back.map((pts, i) => (
          <TaperedLock key={`b${i}`} pts={pts} width={0.3} depth={0.14} material={hairMat} />
        ))}
      </group>
    );
  }

  // ---------------------------------------------------------------------------
  // 'curly': voluminous cloud of round curls (never below the hairline on the face)
  // ---------------------------------------------------------------------------
  if (style === 'curly') {
    const curls: { p: V3; r: number }[] = [];
    let seed = 97;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const rings = [0.15, 0.45, 0.75, 1.02, 1.28, 1.52];
    rings.forEach((phi, ri) => {
      const count = Math.max(4, Math.round(Math.sin(phi) * 16));
      for (let k = 0; k < count; k++) {
        const theta = (k / count) * Math.PI * 2 + ri * 0.35;
        const x = Math.sin(phi) * Math.sin(theta) * 0.8;
        const z = Math.sin(phi) * Math.cos(theta) * 0.8 - 0.06;
        const y = 0.42 + Math.cos(phi) * 0.62;
        // keep the face (+Z) open below the hairline
        if (z > 0.2 && y < 0.62 && Math.abs(x) < 0.62) continue;
        curls.push({ p: [x, y, z], r: 0.2 + rand() * 0.07 });
      }
    });
    // lower back & sides fill
    for (let k = 0; k < 9; k++) {
      const theta = Math.PI * 0.55 + (k / 8) * Math.PI * 0.9;
      curls.push({ p: [Math.sin(theta) * 0.74, 0.0 + (k % 2) * 0.12, Math.cos(theta) * 0.74 - 0.04], r: 0.21 });
    }
    return (
      <group>
        <SculptedCrown material={crownMat} backLength={0.45} volume={1.06} />
        {curls.map((c, i) => (
          <mesh key={i} position={c.p} material={hairMat} castShadow>
            <icosahedronGeometry args={[c.r, 2]} />
          </mesh>
        ))}
      </group>
    );
  }

  // ---------------------------------------------------------------------------
  // 7. 'spikyAnime' (default): Multi-layered Spiky Anime Locks
  // ---------------------------------------------------------------------------
  const spikeAngles = [-0.52, -0.32, -0.10, 0.10, 0.32, 0.52];
  return (
    <group>
      <SculptedCrown material={hairMat} backLength={0.55} volume={1.05} />
      {spikeAngles.map((x, i) => (
        <TaperedLock
          key={`sp${i}`}
          material={hairMat}
          width={0.23}
          depth={0.10}
          pts={[
            [x * 0.4, 0.66, 0.12],
            [x * 0.85, 0.58, 0.50],
            [x * 1.08, 0.42 - (i % 2) * 0.04, 0.64],
            [x * 1.18 + (i % 2 ? 0.06 : -0.06), 0.24 - (i % 3) * 0.04, 0.60],
          ]}
        />
      ))}
      {[-1, 1].map((s) => (
        <React.Fragment key={s}>
          <TaperedLock
            material={hairMat}
            width={0.26}
            depth={0.11}
            pts={[
              [s * 0.35, 0.60, 0.0],
              [s * 0.72, 0.48, 0.12],
              [s * 0.88, 0.25, 0.08],
              [s * 0.96, 0.02, 0.02],
            ]}
          />
          <TaperedLock
            material={hairMat}
            width={0.24}
            depth={0.11}
            pts={[
              [s * 0.42, 0.52, 0.15],
              [s * 0.68, 0.28, 0.26],
              [s * 0.70, -0.04, 0.24],
              [s * 0.64, -0.32, 0.18],
            ]}
          />
        </React.Fragment>
      ))}
    </group>
  );
};
