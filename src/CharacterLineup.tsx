import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { R6Character } from './components/R6Character';
import {
  buildLook,
  CHARACTER_PRESETS,
  CharacterLook,
  CharacterLookOverride,
  HAIR_COLORS,
  HairColorName,
  HairStyle,
  PRESET_NAMES,
  TopStyle,
} from './characters/look';
import { ExpressionId } from './types/schema';

/**
 * Character constructor showcase. Each page shows PER_PAGE actors for FRAMES_PER_PAGE frames.
 *   npx.cmd remotion still src/index.ts CharacterLineup out/lineup-0.png --frame=0
 * Page N starts at frame N * FRAMES_PER_PAGE.
 */

export const PER_PAGE = 5;
export const FRAMES_PER_PAGE = 1;

interface Entry {
  label: string;
  look: CharacterLook;
  expression?: ExpressionId;
}

const o = (label: string, override: CharacterLookOverride, expression?: ExpressionId): Entry => ({
  label,
  look: buildLook(override),
  expression,
});

const presetEntries: Entry[] = PRESET_NAMES.map((n) => ({ label: n, look: CHARACTER_PRESETS[n] }));

const hairStyles: HairStyle[] = [
  'bacon',
  'messyFringe',
  'sidePart',
  'fluffySwept',
  'slickBack',
  'spikyAnime',
  'curly',
  'buzz',
  'bob',
  'wavyLong',
  'ponytail',
  'bun',
  'pigtails',
  'grandpa',
  'none',
];
const hairColorCycle: HairColorName[] = ['black', 'brown', 'blonde', 'ginger', 'darkBrown'];
const hairStyleEntries: Entry[] = hairStyles.map((style, i) =>
  o(`hair: ${style}`, {
    extends: 'kid_boy',
    hair: { style, color: hairColorCycle[i % hairColorCycle.length] },
    top: { style: 'tshirt', color: 'white' },
  })
);

const hairColorEntries: Entry[] = (Object.keys(HAIR_COLORS) as HairColorName[]).map((color, i) =>
  o(`color: ${color}`, {
    extends: 'kid_boy',
    hair: { style: i % 2 ? 'wavyLong' : 'messyFringe', color },
    top: { style: 'tshirt', color: 'lightGray' },
  })
);

const topStyles: [TopStyle, string, string][] = [
  ['tshirt', 'red', 'white'],
  ['hoodie', 'teal', 'black'],
  ['pullover', 'purple', 'white'],
  ['plaid', 'darkRed', 'black'],
  ['polo', 'green', 'white'],
  ['blouse', 'sky', 'white'],
  ['sweater', 'mustard', 'cream'],
  ['vest', 'navy', 'white'],
  ['jacket', 'black', 'yellow'],
  ['uniform', 'navy', 'red'],
  ['suit', 'charcoal', 'blue'],
  ['dress', 'pink', 'white'],
  ['tank', 'orange', 'white'],
];
const topEntries: Entry[] = topStyles.map(([style, color, secondary]) =>
  o(`top: ${style}`, { extends: 'kid_boy', top: { style, color, secondary } })
);

const extraEntries: Entry[] = [
  o('jeans + boots', { extends: 'kid_boy', bottom: { style: 'jeans', color: 'denim' }, shoes: { style: 'boots', color: 'brown' } }),
  o('shorts', { extends: 'kid_boy', bottom: { style: 'shorts', color: 'khaki' }, shoes: { color: 'blue' } }),
  o('skirt + tights', { extends: 'kid_girl', bottom: { style: 'skirt', color: 'navy', legs: 'black' } }),
  o('cap', { extends: 'kid_boy', accessories: [{ type: 'cap', color: 'red' }] }),
  o('beanie', { extends: 'teen_girl', accessories: [{ type: 'beanie', color: 'mustard' }] }),
  o('sunglasses', { extends: 'dad', accessories: ['sunglasses'] }, 'cool'),
  o('headphones', { extends: 'kid_boy', hair: { style: 'curly', color: 'blonde' }, accessories: ['headphones'] }),
  o('crown', { extends: 'kid_girl', hair: { style: 'wavyLong', color: 'platinum' }, accessories: ['crown'] }),
  o('beard', { extends: 'dad', facialHair: 'beard', hair: { color: 'ginger' } }),
  o('freckles + blush', { extends: 'little_brother', blush: true }, 'laugh'),
];

export const LINEUP_ENTRIES: Entry[] = [
  ...presetEntries,
  ...hairStyleEntries,
  ...hairColorEntries,
  ...topEntries,
  ...extraEntries,
];
export const LINEUP_PAGES = Math.ceil(LINEUP_ENTRIES.length / PER_PAGE);

const SPACING = 5.2;
const CAM_Z = 26;
const FOV = 32;

const FixedCamera: React.FC = () => {
  const { camera } = useThree();
  camera.position.set(0, 4.2, CAM_Z);
  camera.lookAt(0, 3.4, 0);
  return null;
};

export const CharacterLineup: React.FC = () => {
  const frame = useCurrentFrame();
  const page = Math.min(LINEUP_PAGES - 1, Math.floor(frame / FRAMES_PER_PAGE));
  const entries = LINEUP_ENTRIES.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const visibleWidth = 2 * CAM_Z * Math.tan(((FOV / 2) * Math.PI) / 180) * (1920 / 1080);

  return (
    <AbsoluteFill style={{ backgroundColor: '#BAE6FD' }}>
      <ThreeCanvas width={1920} height={1080} shadows camera={{ fov: FOV, near: 0.1, far: 200 }}>
        <color attach="background" args={['#BAE6FD']} />
        <FixedCamera />
        <ambientLight intensity={0.85} />
        <hemisphereLight args={['#FFFFFF', '#334155', 0.65]} position={[0, 25, 0]} />
        <directionalLight position={[12, 22, 14]} intensity={2.1} color="#FFFBEB" castShadow />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[80, 40]} />
          <meshStandardMaterial color="#86EFAC" />
        </mesh>
        {entries.map((e, i) => (
          <R6Character
            key={`${page}-${i}`}
            look={e.look}
            position={[(i - (PER_PAGE - 1) / 2) * SPACING, 0, 0]}
            rotationY={0}
            anim="idle"
            expression={e.expression ?? 'smile'}
          />
        ))}
      </ThreeCanvas>
      {entries.map((e, i) => {
        const x = (i - (PER_PAGE - 1) / 2) * SPACING;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: 40,
              left: `${(0.5 + x / visibleWidth) * 100}%`,
              transform: 'translateX(-50%)',
              fontFamily: "'Segoe UI', Arial, sans-serif",
              fontWeight: 800,
              fontSize: 30,
              color: '#0F172A',
              background: 'rgba(255,255,255,0.85)',
              padding: '6px 14px',
              borderRadius: 12,
              whiteSpace: 'nowrap',
            }}
          >
            {e.label}
          </div>
        );
      })}
      <div style={{ position: 'absolute', top: 24, left: 32, fontFamily: 'Segoe UI', fontWeight: 800, fontSize: 28, color: '#0F172A' }}>
        page {page + 1}/{LINEUP_PAGES}
      </div>
    </AbsoluteFill>
  );
};
