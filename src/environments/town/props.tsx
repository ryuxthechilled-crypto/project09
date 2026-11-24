import React from 'react';
import { Ball, Box, Cyl, Panel, textTex, V3 } from '../kit';

/** Street furniture, vegetation and vehicles. All face +Z unless rotated. */

export const BlockTree: React.FC<{ p: V3; scale?: number; leaf?: string }> = ({ p, scale = 1, leaf = '#16A34A' }) => (
  <group position={p} scale={scale}>
    <Box p={[0, 2.5, 0]} s={[1.2, 5, 1.2]} c="#78350F" shadow />
    <Box p={[0, 6.2, 0]} s={[4.6, 4.2, 4.6]} c={leaf} shadow />
    <Box p={[0, 8.6, 0]} s={[3.0, 1.4, 3.0]} c={leaf} shadow />
  </group>
);

export const RoundTree: React.FC<{ p: V3; scale?: number; leaf?: string }> = ({ p, scale = 1, leaf = '#22C55E' }) => (
  <group position={p} scale={scale}>
    <Cyl p={[0, 2.2, 0]} rt={0.45} rb={0.6} h={4.4} c="#7C4A1E" shadow />
    <Ball p={[0, 5.8, 0]} rad={2.6} c={leaf} shadow />
    <Ball p={[1.4, 5.0, 0.6]} rad={1.7} c={leaf} shadow />
    <Ball p={[-1.3, 5.2, -0.5]} rad={1.8} c={leaf} shadow />
  </group>
);

export const PineTree: React.FC<{ p: V3; scale?: number }> = ({ p, scale = 1 }) => (
  <group position={p} scale={scale}>
    <Cyl p={[0, 1.2, 0]} rt={0.4} h={2.4} c="#6B3F1D" />
    <mesh position={[0, 4.2, 0]} castShadow>
      <coneGeometry args={[2.6, 4.5, 8]} />
      <meshStandardMaterial color="#166534" roughness={0.8} />
    </mesh>
    <mesh position={[0, 6.6, 0]} castShadow>
      <coneGeometry args={[1.8, 3.4, 8]} />
      <meshStandardMaterial color="#15803D" roughness={0.8} />
    </mesh>
  </group>
);

export const Bush: React.FC<{ p: V3; scale?: number; c?: string; flowers?: string }> = ({ p, scale = 1, c = '#15803D', flowers }) => (
  <group position={p} scale={scale}>
    <Ball p={[0, 0.7, 0]} rad={1.0} c={c} sc={[1.3, 0.85, 1]} />
    <Ball p={[0.8, 0.55, 0.2]} rad={0.7} c={c} />
    <Ball p={[-0.8, 0.55, 0.1]} rad={0.7} c={c} />
    {flowers &&
      [
        [0.3, 1.35, 0.6],
        [-0.5, 1.2, 0.7],
        [0.9, 1.0, 0.7],
        [-0.9, 0.95, 0.6],
      ].map((fp, i) => <Ball key={i} p={fp as V3} rad={0.16} c={flowers} />)}
  </group>
);

export const PicketFence: React.FC<{ p: V3; length: number; r?: V3; c?: string }> = ({ p, length, r, c = '#F8FAFC' }) => {
  const n = Math.max(2, Math.round(length / 0.7));
  return (
    <group position={p} rotation={r}>
      <Box p={[0, 0.9, 0]} s={[length, 0.2, 0.12]} c={c} />
      <Box p={[0, 1.7, 0]} s={[length, 0.2, 0.12]} c={c} />
      {Array.from({ length: n }, (_, i) => (
        <Box key={i} p={[-length / 2 + (i + 0.5) * (length / n), 1.15, 0.08]} s={[0.36, 2.3, 0.1]} c={c} />
      ))}
    </group>
  );
};

export const MetalFence: React.FC<{ p: V3; length: number; r?: V3; h?: number }> = ({ p, length, r, h = 2.4 }) => {
  const n = Math.max(2, Math.round(length / 0.5));
  return (
    <group position={p} rotation={r}>
      <Box p={[0, h, 0]} s={[length, 0.14, 0.14]} c="#334155" metal={0.4} />
      <Box p={[0, 0.3, 0]} s={[length, 0.14, 0.14]} c="#334155" metal={0.4} />
      {Array.from({ length: n }, (_, i) => (
        <Box key={i} p={[-length / 2 + (i + 0.5) * (length / n), h / 2, 0]} s={[0.08, h, 0.08]} c="#334155" metal={0.4} />
      ))}
    </group>
  );
};

export const StreetLamp: React.FC<{ p: V3; r?: V3; night?: boolean }> = ({ p, r, night }) => (
  <group position={p} rotation={r}>
    <Cyl p={[0, 0.3, 0]} rt={0.35} rb={0.45} h={0.6} c="#1F2937" />
    <Cyl p={[0, 4.2, 0]} rt={0.14} h={8.2} c="#1F2937" metal={0.5} />
    <Box p={[0, 8.2, 0.9]} s={[0.2, 0.2, 1.8]} c="#1F2937" metal={0.5} />
    <Box p={[0, 8.0, 1.8]} s={[0.9, 0.35, 0.9]} c="#1F2937" />
    <Box p={[0, 7.78, 1.8]} s={[0.7, 0.12, 0.7]} c="#FEF9C3" e="#FDE68A" ei={night ? 2.2 : 0.2} />
  </group>
);

export const TrafficLight: React.FC<{ p: V3; r?: V3; lit?: 'red' | 'yellow' | 'green'; arm?: number }> = ({ p, r, lit = 'green', arm = 4 }) => (
  <group position={p} rotation={r}>
    <Cyl p={[0, 4, 0]} rt={0.16} h={8} c="#334155" metal={0.4} />
    <Box p={[0, 7.6, arm / 2]} s={[0.2, 0.2, arm]} c="#334155" metal={0.4} />
    <group position={[0, 6.7, arm - 0.2]}>
      <Box s={[0.9, 2.4, 0.7]} c="#111827" />
      {(['red', 'yellow', 'green'] as const).map((col, i) => {
        const hex = col === 'red' ? '#EF4444' : col === 'yellow' ? '#FACC15' : '#22C55E';
        return (
          <Ball
            key={col}
            p={[0, 0.75 - i * 0.75, 0.36]}
            rad={0.25}
            c={lit === col ? hex : '#1F2937'}
            e={lit === col ? hex : undefined}
            ei={1.6}
            rough={0.2}
          />
        );
      })}
    </group>
  </group>
);

export const StreetSign: React.FC<{ p: V3; r?: V3; a: string; b: string }> = ({ p, r, a, b }) => {
  const ta = textTex([{ text: a, color: '#FFFFFF', size: 120 }], { w: 1024, h: 200, bg: '#15803D', border: '#FFFFFF', borderWidth: 14 });
  const tb = textTex([{ text: b, color: '#FFFFFF', size: 120 }], { w: 1024, h: 200, bg: '#15803D', border: '#FFFFFF', borderWidth: 14 });
  return (
    <group position={p} rotation={r}>
      <Cyl p={[0, 3, 0]} rt={0.1} h={6} c="#475569" metal={0.5} />
      <group position={[0, 5.8, 0]}>
        <Panel p={[0, 0, 0.06]} w={3.2} h={0.62} map={ta} />
        <Panel p={[0, 0, -0.06]} r={[0, Math.PI, 0]} w={3.2} h={0.62} map={ta} />
      </group>
      <group position={[0, 5.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Panel p={[0, 0, 0.06]} w={3.2} h={0.62} map={tb} />
        <Panel p={[0, 0, -0.06]} r={[0, Math.PI, 0]} w={3.2} h={0.62} map={tb} />
      </group>
    </group>
  );
};

export const StopSign: React.FC<{ p: V3; r?: V3 }> = ({ p, r }) => {
  const t = textTex([{ text: 'STOP', color: '#FFFFFF', size: 300 }], { w: 512, h: 512, bg: '#DC2626' });
  return (
    <group position={p} rotation={r}>
      <Cyl p={[0, 2.3, 0]} rt={0.08} h={4.6} c="#94A3B8" metal={0.5} />
      <mesh position={[0, 4.6, 0.06]} rotation={[0, 0, Math.PI / 8]}>
        <circleGeometry args={[0.85, 8]} />
        <meshStandardMaterial map={t} />
      </mesh>
    </group>
  );
};

export const Hydrant: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <Cyl p={[0, 0.9, 0]} rt={0.48} rb={0.56} h={1.8} c="#DC2626" rough={0.35} shadow />
    <Ball p={[0, 1.8, 0]} rad={0.48} c="#B91C1C" rough={0.35} />
    <Cyl p={[0, 1.2, 0]} r={[0, 0, Math.PI / 2]} rt={0.2} h={1.35} c="#E2E8F0" metal={0.5} />
  </group>
);

export const TrashCan: React.FC<{ p: V3; c?: string }> = ({ p, c = '#166534' }) => (
  <group position={p}>
    <Cyl p={[0, 1.0, 0]} rt={0.75} rb={0.65} h={2} c={c} shadow />
    <Cyl p={[0, 2.08, 0]} rt={0.82} h={0.16} c="#1F2937" />
  </group>
);

export const Bench: React.FC<{ p: V3; r?: V3; c?: string }> = ({ p, r, c = '#92400E' }) => (
  <group position={p} rotation={r}>
    <Box p={[0, 1.2, 0]} s={[4.2, 0.22, 1.3]} c={c} shadow />
    <Box p={[0, 2.1, -0.6]} s={[4.2, 1.0, 0.18]} c={c} />
    {[-1.7, 1.7].map((x) => (
      <React.Fragment key={x}>
        <Box p={[x, 0.6, 0]} s={[0.2, 1.2, 1.2]} c="#1F2937" metal={0.4} />
        <Box p={[x, 1.7, -0.6]} s={[0.2, 1.2, 0.2]} c="#1F2937" metal={0.4} />
      </React.Fragment>
    ))}
  </group>
);

export const Mailbox: React.FC<{ p: V3; r?: V3; c?: string }> = ({ p, r, c = '#1F2937' }) => (
  <group position={p} rotation={r}>
    <Box p={[0, 1.0, 0]} s={[0.25, 2.0, 0.25]} c="#78350F" />
    <Box p={[0, 2.2, 0]} s={[0.7, 0.6, 1.2]} c={c} metal={0.3} />
    <Cyl p={[0, 2.5, 0]} r={[Math.PI / 2, 0, 0]} rt={0.35} h={1.2} c={c} metal={0.3} />
    <Box p={[0.4, 2.6, 0.2]} s={[0.06, 0.6, 0.15]} c="#DC2626" />
  </group>
);

export const BusStop: React.FC<{ p: V3; r?: V3 }> = ({ p, r }) => {
  const sign = textTex([{ text: 'BUS', color: '#FFFFFF', size: 150 }], { w: 512, h: 256, bg: '#2563EB' });
  return (
    <group position={p} rotation={r}>
      <Box p={[0, 4.4, 0]} s={[6, 0.25, 2.4]} c="#334155" />
      <Box p={[0, 2.2, -1.1]} s={[6, 4.2, 0.1]} c="#BAE6FD" opacity={0.45} rough={0.1} />
      {[-2.9, 2.9].map((x) => (
        <Box key={x} p={[x, 2.2, -1.1]} s={[0.18, 4.4, 0.18]} c="#334155" />
      ))}
      <Box p={[0, 1.0, -0.6]} s={[4.6, 0.2, 0.9]} c="#64748B" />
      <Cyl p={[3.6, 2.6, 0.4]} rt={0.08} h={5.2} c="#64748B" />
      <Panel p={[3.6, 5.0, 0.48]} w={1.4} h={0.7} map={sign} />
    </group>
  );
};

/** Blocky family car. Front faces +Z. */
export const Car: React.FC<{ p: V3; r?: V3; c?: string; night?: boolean }> = ({ p, r, c = '#DC2626', night }) => (
  <group position={p} rotation={r}>
    <Box p={[0, 1.15, 0]} s={[3.6, 1.3, 7.0]} c={c} rough={0.3} metal={0.2} shadow />
    <Box p={[0, 2.35, -0.5]} s={[3.2, 1.15, 3.6]} c={c} rough={0.3} metal={0.2} shadow />
    <Box p={[0, 2.35, 1.31]} s={[2.9, 0.9, 0.08]} c="#1E293B" rough={0.1} metal={0.5} r={[-0.25, 0, 0]} />
    <Box p={[0, 2.35, -2.31]} s={[2.9, 0.9, 0.08]} c="#1E293B" rough={0.1} metal={0.5} />
    {[-1, 1].map((s) => (
      <Box key={s} p={[s * 1.61, 2.35, -0.5]} s={[0.04, 0.85, 3.2]} c="#1E293B" rough={0.1} metal={0.5} />
    ))}
    {[
      [-1.7, 0.55, 2.3],
      [1.7, 0.55, 2.3],
      [-1.7, 0.55, -2.3],
      [1.7, 0.55, -2.3],
    ].map((wp, i) => (
      <group key={i} position={wp as V3}>
        <Cyl r={[0, 0, Math.PI / 2]} rt={0.62} h={0.5} c="#111827" rough={0.9} />
        <Cyl r={[0, 0, Math.PI / 2]} rt={0.32} h={0.54} c="#CBD5E1" metal={0.6} />
      </group>
    ))}
    {[-1.15, 1.15].map((x) => (
      <React.Fragment key={x}>
        <Box p={[x, 1.25, 3.52]} s={[0.8, 0.4, 0.06]} c="#FEF9C3" e="#FEF08A" ei={night ? 2 : 0.3} />
        <Box p={[x, 1.25, -3.52]} s={[0.8, 0.35, 0.06]} c="#DC2626" e="#EF4444" ei={night ? 1.5 : 0.3} />
      </React.Fragment>
    ))}
    <Box p={[0, 0.75, 3.55]} s={[3.4, 0.35, 0.15]} c="#94A3B8" metal={0.6} />
  </group>
);

export const SchoolBus: React.FC<{ p: V3; r?: V3 }> = ({ p, r }) => {
  const label = textTex([{ text: 'SCHOOL BUS', color: '#111827', size: 120 }], { w: 1024, h: 180, bg: '#FACC15' });
  return (
    <group position={p} rotation={r}>
      <Box p={[0, 2.6, 0]} s={[4.2, 4.0, 16]} c="#FACC15" rough={0.4} shadow />
      <Box p={[0, 1.6, 8.8]} s={[4.0, 2.0, 1.8]} c="#FACC15" rough={0.4} shadow />
      <Box p={[0, 1.0, 0]} s={[4.25, 0.3, 16]} c="#111827" />
      {Array.from({ length: 6 }, (_, i) => (
        <React.Fragment key={i}>
          <Box p={[2.12, 3.4, -6 + i * 2.3]} s={[0.05, 1.3, 1.8]} c="#1E293B" rough={0.1} />
          <Box p={[-2.12, 3.4, -6 + i * 2.3]} s={[0.05, 1.3, 1.8]} c="#1E293B" rough={0.1} />
        </React.Fragment>
      ))}
      <Box p={[0, 3.4, 8.02]} s={[3.6, 1.4, 0.05]} c="#1E293B" rough={0.1} />
      <Panel p={[2.14, 2.0, 0]} r={[0, Math.PI / 2, 0]} w={7} h={1.2} map={label} />
      <Panel p={[-2.14, 2.0, 0]} r={[0, -Math.PI / 2, 0]} w={7} h={1.2} map={label} />
      {[
        [-2.1, 0.8, 6],
        [2.1, 0.8, 6],
        [-2.1, 0.8, -5],
        [2.1, 0.8, -5],
      ].map((wp, i) => (
        <Cyl key={i} p={wp as V3} r={[0, 0, Math.PI / 2]} rt={0.8} h={0.6} c="#111827" rough={0.9} />
      ))}
    </group>
  );
};

export const BikeRack: React.FC<{ p: V3; r?: V3 }> = ({ p, r }) => (
  <group position={p} rotation={r}>
    {[-1.5, -0.5, 0.5, 1.5].map((x) => (
      <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.7, 0.07, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.6} roughness={0.3} />
      </mesh>
    ))}
  </group>
);

export const Flagpole: React.FC<{ p: V3; t: number }> = ({ p, t }) => (
  <group position={p}>
    <Box p={[0, 0.25, 0]} s={[1.6, 0.5, 1.6]} c="#CBD5E1" />
    <Cyl p={[0, 7, 0]} rt={0.12} h={14} c="#E2E8F0" metal={0.6} />
    <Ball p={[0, 14.1, 0]} rad={0.25} c="#FACC15" rough={0.2} />
    <group position={[0, 12.6, 0]}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Box
          key={i}
          p={[0.35 + i * 0.6, Math.sin(t * 4 - i * 0.8) * 0.12 * i * 0.3, Math.sin(t * 3 - i) * 0.1 * i]}
          s={[0.62, 2.2, 0.06]}
          c={i < 2 ? '#1D4ED8' : i % 2 ? '#FFFFFF' : '#DC2626'}
        />
      ))}
    </group>
  </group>
);

export const VendingMachine: React.FC<{ p: V3; r?: V3; night?: boolean }> = ({ p, r, night }) => {
  const label = textTex([{ text: 'BLOXY COLA', color: '#FFFFFF', size: 110 }], { w: 1024, h: 256, bg: '#B91C1C' });
  return (
    <group position={p} rotation={r}>
      <Box p={[0, 2.5, 0]} s={[2.4, 5, 1.6]} c="#DC2626" shadow />
      <Box p={[-0.3, 2.9, 0.81]} s={[1.5, 2.8, 0.05]} c="#FECACA" e="#FCA5A5" ei={night ? 1.2 : 0.3} />
      <Panel p={[0, 4.6, 0.82]} w={2.2} h={0.55} map={label} />
      <Box p={[0.8, 2.9, 0.82]} s={[0.4, 1.4, 0.05]} c="#1F2937" />
      <Box p={[0, 0.9, 0.82]} s={[1.6, 0.5, 0.05]} c="#111827" />
    </group>
  );
};
