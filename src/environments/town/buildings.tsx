import React from 'react';
import * as THREE from 'three';
import {
  Ball,
  Box,
  brickTex,
  Cyl,
  Door,
  GableRoof,
  Panel,
  Prism,
  sidingTex,
  stripeTex,
  studTex,
  textTex,
  V3,
  Window,
} from '../kit';
import {
  Bench,
  BikeRack,
  BlockTree,
  Bush,
  Car,
  Flagpole,
  Mailbox,
  MetalFence,
  PicketFence,
  RoundTree,
  SchoolBus,
  TrashCan,
  VendingMachine,
} from './props';

// ===========================================================================
// HERO HOUSES
// ===========================================================================

export type HouseVariant = 'blue' | 'yellow' | 'red' | 'white' | 'green';

interface HouseStyle {
  wall: string;
  trim: string;
  roof: string;
  door: string;
  floors: 1 | 2;
  roofType: 'gable' | 'flat';
  material: 'siding' | 'brick' | 'paint';
  porch?: boolean;
  garage?: boolean;
  shutters?: string;
  car?: string;
  fence?: string;
  flowers?: string;
}

export const HOUSE_STYLES: Record<HouseVariant, HouseStyle> = {
  blue: { wall: '#7DD3FC', trim: '#F8FAFC', roof: '#1E3A8A', door: '#B45309', floors: 2, roofType: 'gable', material: 'siding', shutters: '#1E40AF', fence: '#F8FAFC', flowers: '#F472B6' },
  yellow: { wall: '#FDE68A', trim: '#FFFFFF', roof: '#B91C1C', door: '#1D4ED8', floors: 1, roofType: 'gable', material: 'siding', porch: true, fence: '#FFFFFF', flowers: '#EF4444' },
  red: { wall: '#B4472E', trim: '#F8FAFC', roof: '#334155', door: '#166534', floors: 2, roofType: 'gable', material: 'brick', shutters: '#14532D', car: '#2563EB' },
  white: { wall: '#F1F5F9', trim: '#334155', roof: '#475569', door: '#DC2626', floors: 2, roofType: 'flat', material: 'paint', garage: true, car: '#111827' },
  green: { wall: '#A7F3D0', trim: '#FFFFFF', roof: '#7C2D12', door: '#F59E0B', floors: 1, roofType: 'gable', material: 'siding', garage: true, porch: true, fence: '#FFFFFF', car: '#DC2626', flowers: '#FACC15' },
};

const HOUSE_W = 12;
const HOUSE_D = 10;
const FLOOR_H = 4.4;

/**
 * Hero house; origin = center of the footprint on the ground, front door faces +Z.
 * Front wall at z = +5, the lot's front yard extends ~7 studs toward +Z.
 */
export const House: React.FC<{ variant: HouseVariant; night?: boolean; yard?: number }> = ({ variant, night = false, yard = 7 }) => {
  const st = HOUSE_STYLES[variant];
  const H = st.floors === 1 ? 7.6 : st.floors * FLOOR_H + 0.4;
  const porchTop = H + 0.1; // just under the eave
  const wallMap =
    st.material === 'brick'
      ? brickTex(st.wall, '#E7E5E4', HOUSE_W / 2, H / 1.6)
      : st.material === 'siding'
      ? sidingTex(st.wall, 2, Math.round(H / 1.2))
      : undefined;
  const front = HOUSE_D / 2;

  return (
    <group>
      {/* foundation + body */}
      <Box p={[0, 0.3, 0]} s={[HOUSE_W + 0.4, 0.6, HOUSE_D + 0.4]} c="#9CA3AF" />
      <mesh position={[0, H / 2 + 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[HOUSE_W, H, HOUSE_D]} />
        <meshStandardMaterial color={wallMap ? '#FFFFFF' : st.wall} map={wallMap} roughness={0.75} />
      </mesh>
      {/* corner trims */}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => <Box key={`${sx}${sz}`} p={[sx * (HOUSE_W / 2), H / 2 + 0.3, sz * (HOUSE_D / 2)]} s={[0.35, H, 0.35]} c={st.trim} />)
      )}
      {st.floors === 2 && <Box p={[0, FLOOR_H + 0.4, front + 0.05]} s={[HOUSE_W, 0.25, 0.2]} c={st.trim} />}

      {/* roof */}
      {st.roofType === 'gable' ? (
        <>
          <Prism p={[0, H + 0.3, 0]} width={HOUSE_W} depth={HOUSE_D} height={3.6} c={st.wall} map={wallMap} />
          <GableRoof p={[0, H + 0.3, 0]} width={HOUSE_W} depth={HOUSE_D} height={3.6} color={st.roof} />
          <Box p={[3.2, H + 3.6, -1.2]} s={[1.3, 3.2, 1.3]} map={brickTex('#9A3412', '#D6D3D1', 1, 2)} shadow />
        </>
      ) : (
        <>
          <Box p={[0, H + 0.45, 0]} s={[HOUSE_W + 0.8, 0.3, HOUSE_D + 0.8]} c={st.roof} />
          <Box p={[0, H + 0.9, front + 0.2]} s={[HOUSE_W + 0.8, 0.6, 0.3]} c={st.trim} />
          <Box p={[-2.5, H + 1.2, -1]} s={[2.4, 1.2, 1.8]} c="#CBD5E1" metal={0.3} />
          {/* modern glass strip */}
          <Box p={[3.0, FLOOR_H + 2.6, front + 0.06]} s={[4.6, 1.6, 0.1]} c={night ? '#FDE68A' : '#1E293B'} e={night ? '#FBBF24' : undefined} ei={0.9} rough={0.1} metal={0.4} />
        </>
      )}

      {/* front door + steps */}
      <Door p={[0, 0.6, front]} color={st.door} trim={st.trim} />
      <Box p={[0, 0.45, front + 0.8]} s={[3.4, 0.3, 1.4]} c="#CBD5E1" />
      <Box p={[0, 0.15, front + 1.6]} s={[3.8, 0.3, 1.2]} c="#CBD5E1" />
      <Box p={[0, 5.35, front + 0.6]} s={[3.6, 0.2, 1.4]} c={st.trim} />
      <Ball p={[-1.6, 4.4, front + 0.3]} rad={0.2} c="#FEF9C3" e="#FDE68A" ei={night ? 2.5 : 0.2} />

      {/* windows: ground floor */}
      <Window p={[-3.7, st.floors === 1 ? 3.6 : 2.9, front]} trim={st.trim} night={night} shutters={st.shutters} />
      {!(st.roofType === 'flat') && <Window p={[3.7, st.floors === 1 ? 3.6 : 2.9, front]} trim={st.trim} night={night} shutters={st.shutters} />}
      {st.roofType === 'flat' && <Window p={[3.7, 2.9, front]} w={3.4} trim={st.trim} night={night} />}
      {/* upper floor */}
      {st.floors === 2 &&
        (st.roofType === 'flat' ? (
          <Window p={[-3.7, FLOOR_H + 2.6, front]} trim={st.trim} night={night} />
        ) : (
          [-3.7, 0, 3.7].map((x) => <Window key={x} p={[x, FLOOR_H + 2.6, front]} trim={st.trim} night={night} shutters={st.shutters} />)
        ))}
      {/* side windows */}
      {[-1, 1].map((s) => (
        <Window key={`sw${s}`} p={[s * (HOUSE_W / 2), 2.9, 0]} r={[0, (s * Math.PI) / 2, 0]} trim={st.trim} night={night} />
      ))}
      {/* porch */}
      {st.porch && (
        <group>
          <Box p={[0, 0.5, front + 1.6]} s={[HOUSE_W - 1, 0.4, 3.2]} c="#A16207" />
          {[-5, -2, 2, 5].map((x) => (
            <Box key={x} p={[x, (porchTop + 0.7) / 2, front + 2.9]} s={[0.35, porchTop - 0.7, 0.35]} c={st.trim} />
          ))}
          <Box p={[0, porchTop, front + 1.7]} s={[HOUSE_W, 0.3, 3.6]} c={st.roof} shadow />
          <Box p={[-3.5, 1.8, front + 3.0]} s={[3.6, 0.15, 0.15]} c={st.trim} />
          <Box p={[3.5, 1.8, front + 3.0]} s={[3.6, 0.15, 0.15]} c={st.trim} />
        </group>
      )}

      {/* garage */}
      {st.garage && (
        <group position={[HOUSE_W / 2 + 3.6, 0, 0.6]}>
          <Box p={[0, 2.3, 0]} s={[7, 4.6, HOUSE_D - 1.2]} c={st.wall} map={wallMap} shadow />
          <Box p={[0, 4.75, 0.2]} s={[7.6, 0.3, HOUSE_D - 0.4]} c={st.roof} />
          <group position={[0, 0, (HOUSE_D - 1.2) / 2 + 0.05]}>
            <Box p={[0, 1.9, 0]} s={[5.6, 3.6, 0.12]} c={st.trim} />
            {[0, 1, 2, 3].map((i) => (
              <Box key={i} p={[0, 0.55 + i * 0.9, 0.08]} s={[5.4, 0.08, 0.06]} c={new THREE.Color(st.trim).multiplyScalar(0.8).getStyle()} />
            ))}
          </group>
          {/* driveway */}
          <Box p={[0, 0.04, HOUSE_D / 2 + yard / 2]} s={[6, 0.08, yard + 2]} c="#A8A29E" />
        </group>
      )}

      {/* front yard */}
      <Box p={[0, 0.05, front + 2.2 + (yard - 2.2) / 2]} s={[1.8, 0.1, yard - 2.2]} c="#D6D3D1" />
      <Bush p={[-3.6, 0, front + 1.2]} flowers={st.flowers} />
      <Bush p={[3.6, 0, front + 1.2]} flowers={st.flowers} />
      {st.fence && (
        <>
          <PicketFence p={[-HOUSE_W / 2 - 0.6, 0, front + yard / 2]} r={[0, Math.PI / 2, 0]} length={yard} c={st.fence} />
          {!st.garage && <PicketFence p={[HOUSE_W / 2 + 0.6, 0, front + yard / 2]} r={[0, Math.PI / 2, 0]} length={yard} c={st.fence} />}
        </>
      )}
      <Mailbox p={[-HOUSE_W / 2 + 0.6, 0, front + yard - 0.6]} r={[0, Math.PI / 2, 0]} c={st.door} />
      {st.car && <CarSlot color={st.car} x={st.garage ? HOUSE_W / 2 + 3.6 : -HOUSE_W / 2 - 3.5} z={front + 2.8} night={night} />}
      <RoundTree p={[st.garage ? -HOUSE_W / 2 - 3.5 : HOUSE_W / 2 + 4, 0, front - 1]} leaf={variant === 'red' ? '#65A30D' : '#22C55E'} />
    </group>
  );
};

const CarSlot: React.FC<{ color: string; x: number; z: number; night: boolean }> = ({ color, x, z, night }) => (
  <Car p={[x, 0, z]} r={[0, Math.PI, 0]} c={color} night={night} />
);

// ===========================================================================
// SCHOOL
// ===========================================================================

/**
 * Town school; origin = center of the building footprint, entrance faces +Z.
 * Facade at z = +7, entrance steps reach z ≈ +10, schoolyard extends further.
 */
export const School: React.FC<{ night?: boolean; t: number; name?: string }> = ({ night = false, t, name = 'ROBLOX TOWN SCHOOL' }) => {
  const W = 40;
  const D = 14;
  const H = 13;
  const wall = brickTex('#B91C1C', '#FDE2E2', W / 2.2, H / 1.6);
  const wingWall = brickTex('#B91C1C', '#FDE2E2', 6, H / 1.6);
  const sign = textTex([{ text: name, color: '#FFFFFF', size: 92 }], { w: 1536, h: 220, bg: '#1E3A8A', border: '#FACC15', borderWidth: 16 });
  const front = D / 2;
  const clockAngle = t * 0.5;

  return (
    <group>
      <Box p={[0, H / 2, 0]} s={[W, H, D]} map={wall} shadow />
      {/* white cornice + parapet */}
      <Box p={[0, H + 0.3, 0]} s={[W + 0.8, 0.6, D + 0.8]} c="#F8FAFC" />
      <Box p={[0, 4.4, front + 0.1]} s={[W, 0.35, 0.3]} c="#F8FAFC" />
      <Box p={[0, 8.8, front + 0.1]} s={[W, 0.35, 0.3]} c="#F8FAFC" />
      {/* window grid: 3 floors × 10 cols (center reserved for entrance) */}
      {[2.4, 6.7, 11.0].flatMap((y, fi) =>
        [-17, -13.5, -10, -6.5, 6.5, 10, 13.5, 17].map((x) => (
          <Window key={`${fi}:${x}`} p={[x, y, front]} w={2.4} h={2.6} trim="#F8FAFC" night={night} glass="#93C5FD" />
        ))
      )}
      {/* side windows */}
      {[-1, 1].flatMap((s) =>
        [2.4, 6.7, 11.0].map((y) =>
          [-3, 3].map((z) => <Window key={`s${s}${y}${z}`} p={[s * (W / 2), y, z]} r={[0, (s * Math.PI) / 2, 0]} w={2.4} h={2.6} night={night} />)
        )
      )}

      {/* central entrance tower */}
      <group position={[0, 0, front]}>
        <Box p={[0, (H + 3) / 2, 0.8]} s={[11, H + 3, 1.8]} map={wingWall} shadow />
        <Box p={[0, H + 3.2, 0.8]} s={[11.8, 0.6, 2.4]} c="#F8FAFC" />
        {/* clock */}
        <group position={[0, H + 0.4, 1.75]}>
          <Cyl r={[Math.PI / 2, 0, 0]} rt={1.5} h={0.2} c="#F8FAFC" />
          <Cyl r={[Math.PI / 2, 0, 0]} p={[0, 0, -0.05]} rt={1.7} h={0.2} c="#1E293B" />
          <Box p={[0, 0, 0.14]} r={[0, 0, -clockAngle / 12]} s={[0.14, 1.0, 0.05]} c="#111827" />
          <Box p={[0, 0, 0.16]} r={[0, 0, -clockAngle]} s={[0.1, 1.3, 0.05]} c="#111827" />
        </group>
        <Panel p={[0, 9.9, 1.72]} w={10} h={1.45} map={sign} />
        {/* glass double doors */}
        <Box p={[0, 3.0, 1.72]} s={[6.4, 6.0, 0.1]} c="#F8FAFC" />
        {[-1.5, 1.5].map((x) => (
          <Box key={x} p={[x, 2.8, 1.8]} s={[2.8, 5.4, 0.1]} c={night ? '#FDE68A' : '#BAE6FD'} e={night ? '#FBBF24' : '#38BDF8'} ei={night ? 0.8 : 0.15} rough={0.1} />
        ))}
        <Box p={[0, 2.8, 1.87]} s={[0.15, 5.4, 0.05]} c="#94A3B8" />
        <Window p={[0, 7.4, 1.72]} w={6} h={2.2} trim="#F8FAFC" night={night} />
        {/* canopy + columns */}
        <Box p={[0, 6.6, 4.4]} s={[12, 0.5, 5.6]} c="#F8FAFC" shadow />
        {[-5.2, -2.2, 2.2, 5.2].map((x) => (
          <Cyl key={x} p={[x, 3.3, 6.6]} rt={0.38} h={6.6} c="#F8FAFC" />
        ))}
        {/* steps */}
        {[0, 1, 2].map((i) => (
          <Box key={i} p={[0, 0.2 + i * 0.25 - 0.25, 3.4 + (2 - i) * 1.1]} s={[14 - i, 0.25 + i * 0.25, 1.1 + (2 - i) * 2.2]} c="#D6D3D1" />
        ))}
      </group>

      {/* yard dressing (in front, z = 9 … 22) */}
      <Box p={[0, 0.03, front + 9]} s={[W + 6, 0.06, 18]} map={studTex('#D6D3D1', '#A8A29E', 20, 8)} />
      <Flagpole p={[-11, 0, front + 9]} t={t} />
      <BikeRack p={[12, 0, front + 6]} />
      <Bench p={[-17, 0, front + 6]} r={[0, 0, 0]} c="#1D4ED8" />
      <Bench p={[17, 0, front + 6]} c="#1D4ED8" />
      <TrashCan p={[-14.5, 0, front + 6]} c="#1D4ED8" />
      <SchoolBus p={[W / 2 + 6, 0, 2]} />
      {[-1, 1].map((s) => (
        <React.Fragment key={s}>
          <MetalFence p={[s * 14, 0, front + 17.6]} length={18} />
          <BlockTree p={[s * (W / 2 + 1), 0, front + 10]} />
          <Bush p={[s * 8.5, 0, front + 1.4]} flowers="#FACC15" />
        </React.Fragment>
      ))}
      {/* basketball hoop on the side yard */}
      <group position={[-W / 2 - 7, 0, 4]} rotation={[0, Math.PI / 2, 0]}>
        <Cyl p={[0, 3.8, 0]} rt={0.18} h={7.6} c="#334155" />
        <Box p={[0, 7.6, 0.7]} s={[3.4, 2.2, 0.15]} c="#F8FAFC" />
        <mesh position={[0, 6.9, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.06, 8, 20]} />
          <meshStandardMaterial color="#EA580C" />
        </mesh>
      </group>
    </group>
  );
};

// ===========================================================================
// SHOP
// ===========================================================================

/** Corner mini-mart; origin = footprint center, storefront faces +Z (front at z = +5). */
export const Shop: React.FC<{ night?: boolean; name?: string }> = ({ night = false, name = 'RoMART' }) => {
  const W = 16;
  const D = 10;
  const H = 8;
  const sign = textTex([{ text: name, color: '#1E3A8A', size: 150 }], { w: 1024, h: 220, bg: '#FACC15' });
  const awning = stripeTex('#DC2626', '#F8FAFC', 12);
  const front = D / 2;
  return (
    <group>
      <Box p={[0, H / 2, 0]} s={[W, H, D]} c="#38BDF8" shadow />
      <Box p={[0, H + 0.3, 0]} s={[W + 0.6, 0.6, D + 0.6]} c="#0369A1" />
      <Panel p={[0, H - 1.0, front + 0.06]} w={10} h={2.1} map={sign} glow={night ? 0.6 : 0} />
      {/* storefront glass */}
      <Box p={[-3.4, 2.7, front + 0.05]} s={[7.4, 4.4, 0.1]} c={night ? '#FEF3C7' : '#BAE6FD'} e={night ? '#FDE68A' : '#38BDF8'} ei={night ? 1 : 0.2} rough={0.1} />
      <Box p={[5.0, 2.5, front + 0.05]} s={[3.2, 5.0, 0.1]} c={night ? '#FEF3C7' : '#BAE6FD'} e={night ? '#FDE68A' : '#38BDF8'} ei={night ? 1 : 0.2} rough={0.1} />
      <Box p={[5.0, 2.5, front + 0.12]} s={[0.12, 5.0, 0.05]} c="#1E293B" />
      <Box p={[-3.4, 0.3, front + 0.15]} s={[7.6, 0.6, 0.2]} c="#0369A1" />
      {/* posters in the window */}
      <Panel p={[-5.6, 3.2, front + 0.12]} w={1.6} h={2} map={textTex([{ text: 'SALE', color: '#FFFFFF', size: 200 }], { w: 512, h: 640, bg: '#DC2626' })} />
      <Panel p={[-1.6, 3.2, front + 0.12]} w={1.6} h={2} map={textTex([{ text: 'R$1', color: '#111827', size: 200 }], { w: 512, h: 640, bg: '#FDE047' })} />
      {/* striped awning */}
      <mesh position={[-1, 5.6, front + 1.3]} rotation={[0.45, 0, 0]} castShadow>
        <boxGeometry args={[W - 1.5, 0.15, 2.8]} />
        <meshStandardMaterial map={awning} />
      </mesh>
      <VendingMachine p={[W / 2 - 1.6, 0, front + 1.4]} night={night} />
      <TrashCan p={[-W / 2 + 1, 0, front + 1.4]} c="#475569" />
      <Bench p={[-2.5, 0, front + 2.4]} c="#0369A1" />
      {/* side + back simple windows */}
      <Window p={[-W / 2, 3, 0]} r={[0, -Math.PI / 2, 0]} night={night} />
      <Window p={[W / 2, 3, 0]} r={[0, Math.PI / 2, 0]} night={night} />
    </group>
  );
};

// ===========================================================================
// PLAYGROUND / PARK
// ===========================================================================

/** Fenced playground; origin = center of the play area, entrance gate faces +Z. */
export const Playground: React.FC<{ t: number }> = ({ t }) => {
  const swing = Math.sin(t * 2.2) * 0.35;
  return (
    <group>
      {/* soft rubber floor */}
      <Box p={[0, 0.04, -2]} s={[26, 0.08, 18]} map={studTex('#FB923C', '#EA580C', 13, 9)} />
      {/* slide tower */}
      <group position={[-7, 0, -5]}>
        {[
          [-1.4, -1.4],
          [1.4, -1.4],
          [-1.4, 1.4],
          [1.4, 1.4],
        ].map(([x, z], i) => (
          <Box key={i} p={[x, 2.8, z]} s={[0.35, 5.6, 0.35]} c="#2563EB" />
        ))}
        <Box p={[0, 3.6, 0]} s={[3.4, 0.3, 3.4]} c="#FACC15" shadow />
        <mesh position={[0, 6.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.8, 2.0, 4]} />
          <meshStandardMaterial color="#DC2626" roughness={0.5} />
        </mesh>
        {/* ladder */}
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} p={[0, 0.8 + i * 0.8, -2.1]} s={[1.6, 0.15, 0.2]} c="#2563EB" />
        ))}
        {[-0.8, 0.8].map((x) => (
          <Box key={x} p={[x, 1.8, -2.1]} s={[0.15, 3.6, 0.2]} c="#2563EB" />
        ))}
        {/* slide */}
        <mesh position={[3.9, 1.95, 0]} rotation={[0, 0, -0.62]} castShadow>
          <boxGeometry args={[5.4, 0.2, 1.8]} />
          <meshStandardMaterial color="#22C55E" roughness={0.3} />
        </mesh>
        {[-0.9, 0.9].map((z) => (
          <mesh key={z} position={[3.9, 2.25, z]} rotation={[0, 0, -0.62]}>
            <boxGeometry args={[5.4, 0.5, 0.14]} />
            <meshStandardMaterial color="#16A34A" />
          </mesh>
        ))}
      </group>
      {/* swing set */}
      <group position={[6.5, 0, -6]}>
        {[-3.5, 3.5].map((x) => (
          <React.Fragment key={x}>
            <Box p={[x, 2.9, -0.9]} r={[0.32, 0, 0]} s={[0.3, 6.2, 0.3]} c="#DC2626" />
            <Box p={[x, 2.9, 0.9]} r={[-0.32, 0, 0]} s={[0.3, 6.2, 0.3]} c="#DC2626" />
          </React.Fragment>
        ))}
        <Box p={[0, 5.85, 0]} s={[7.4, 0.3, 0.3]} c="#DC2626" />
        {[-1.6, 1.6].map((x, i) => (
          <group key={x} position={[x, 5.8, 0]} rotation={[i ? swing : -swing, 0, 0]}>
            {[-0.5, 0.5].map((cx) => (
              <Box key={cx} p={[cx, -2.1, 0]} s={[0.05, 4.2, 0.05]} c="#94A3B8" metal={0.6} />
            ))}
            <Box p={[0, -4.2, 0]} s={[1.3, 0.15, 0.6]} c="#1F2937" />
          </group>
        ))}
      </group>
      {/* sandbox */}
      <group position={[6, 0, 3]}>
        <Box p={[0, 0.25, 0]} s={[5, 0.5, 4]} c="#A16207" />
        <Box p={[0, 0.3, 0]} s={[4.4, 0.5, 3.4]} c="#FDE68A" />
        <Ball p={[0.8, 0.6, 0.4]} rad={0.5} c="#FDE68A" sc={[1, 0.5, 1]} />
        <Box p={[-1, 0.7, -0.6]} s={[0.6, 0.5, 0.6]} c="#EF4444" />
      </group>
      {/* seesaw */}
      <group position={[-6, 0, 4]}>
        <Box p={[0, 0.5, 0]} s={[0.6, 1, 0.8]} c="#7C3AED" />
        <Box p={[0, 1.05, 0]} r={[0, 0, Math.sin(t * 1.6) * 0.22]} s={[6, 0.2, 0.7]} c="#FACC15" />
      </group>
      {/* benches + trees + fence */}
      <Bench p={[-11, 0, -10]} />
      <Bench p={[11, 0, -10]} />
      <RoundTree p={[-12, 0, 6]} />
      <RoundTree p={[12, 0, 5]} leaf="#65A30D" />
      <BlockTree p={[0, 0, -12]} scale={1.1} />
      <PicketFence p={[-8.5, 0, 9.5]} length={9} c="#FDE68A" />
      <PicketFence p={[8.5, 0, 9.5]} length={9} c="#FDE68A" />
      {[-4, 4].map((x) => (
        <Box key={x} p={[x, 1.6, 9.5]} s={[0.5, 3.2, 0.5]} c="#16A34A" />
      ))}
      {/* park sign board beside the gate */}
      <group position={[-9, 0, 10.6]}>
        {[-1.6, 1.6].map((x) => (
          <Box key={x} p={[x, 1.6, 0]} s={[0.3, 3.2, 0.3]} c="#78350F" />
        ))}
        <Panel p={[0, 3.6, 0.2]} w={4.4} h={1.0} map={textTex([{ text: 'TOWN PARK', color: '#FFFFFF', size: 130 }], { w: 1024, h: 220, bg: '#16A34A' })} />
      </group>
    </group>
  );
};
