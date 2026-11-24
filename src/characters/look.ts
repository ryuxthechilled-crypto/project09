/**
 * CHARACTER CONSTRUCTOR
 * ---------------------
 * Every R6 actor is described by a `CharacterLook`. Colors accept either a palette
 * name (`'ginger'`, `'navy'`, `'tan'`) or any hex string (`'#FF00AA'`).
 *
 * In a story:
 *   cast: {
 *     leo:   { extends: 'kid_boy', hair: { color: 'ginger' }, top: { color: 'red' } },
 *     sarah: 'schoolgirl',
 *     dad:   { skin: 'tan', hair: { style: 'buzz', color: 'black' }, top: { style: 'polo', color: 'navy' } },
 *   },
 *   scenes: [{ characters: { leo: [...keyframes], sarah: [...], dad: [...] } }]
 *
 * An actor id that is not in `cast` but matches a preset name uses that preset.
 */

// ---------------------------------------------------------------------------
// Palettes
// ---------------------------------------------------------------------------

export const HAIR_COLORS = {
  black: { color: '#141210', highlight: '#3A3532' },
  darkBrown: { color: '#23120B', highlight: '#4A2511' },
  brown: { color: '#4A210F', highlight: '#7C3A1D' },
  lightBrown: { color: '#8A5A33', highlight: '#B07A4A' },
  blonde: { color: '#C49A6C', highlight: '#E6C594' },
  goldenBlonde: { color: '#D4A23A', highlight: '#F2CC6A' },
  platinum: { color: '#E8DCC0', highlight: '#FFF8E6' },
  ginger: { color: '#B5471B', highlight: '#E07A3A' },
  auburn: { color: '#6E2412', highlight: '#9C3E22' },
  gray: { color: '#8C8C8C', highlight: '#BDBDBD' },
  white: { color: '#E2E8F0', highlight: '#FFFFFF' },
  pink: { color: '#E879A6', highlight: '#F9B4CF' },
  blue: { color: '#2563EB', highlight: '#60A5FA' },
  purple: { color: '#7C3AED', highlight: '#A78BFA' },
} as const;
export type HairColorName = keyof typeof HAIR_COLORS;

export const SKIN_TONES = {
  porcelain: '#F9E4D2',
  fair: '#F5DEC9',
  light: '#F3C6A0',
  medium: '#E6B891',
  tan: '#C98E62',
  brown: '#9C6644',
  dark: '#6B4226',
  deep: '#4A2C1A',
  classic: '#F5CD30', // old-school yellow Roblox noob
} as const;
export type SkinToneName = keyof typeof SKIN_TONES;

export const CLOTH_COLORS = {
  white: '#F8FAFC',
  cream: '#FEF3C7',
  lightGray: '#CBD5E1',
  gray: '#64748B',
  charcoal: '#334155',
  black: '#18181B',
  red: '#DC2626',
  darkRed: '#991B1B',
  maroon: '#7F1D1D',
  pink: '#EC4899',
  rose: '#E11D48',
  orange: '#EA580C',
  mustard: '#CA8A04',
  yellow: '#FACC15',
  lime: '#84CC16',
  green: '#16A34A',
  darkGreen: '#14532D',
  olive: '#4D5B2A',
  teal: '#2DD4BF',
  cyan: '#06B6D4',
  sky: '#38BDF8',
  blue: '#2563EB',
  royal: '#1D4ED8',
  navy: '#1E293B',
  purple: '#7C3AED',
  lavender: '#C4B5FD',
  brown: '#78350F',
  tan: '#C2A378',
  khaki: '#A8946A',
  denim: '#3B5B8C',
  darkDenim: '#1F2F4D',
} as const;
export type ClothColorName = keyof typeof CLOTH_COLORS;

/** Palette name or any hex (#RRGGBB). */
export type ColorInput = ClothColorName | HairColorName | SkinToneName | (string & {});

// ---------------------------------------------------------------------------
// Parts
// ---------------------------------------------------------------------------

export type HairStyle =
  | 'bacon'
  | 'messyFringe'
  | 'sidePart'
  | 'fluffySwept'
  | 'slickBack'
  | 'spikyAnime'
  | 'curly'
  | 'buzz'
  | 'bob'
  | 'wavyLong'
  | 'ponytail'
  | 'bun'
  | 'pigtails'
  | 'grandpa'
  | 'none';

export type TopStyle =
  | 'tshirt' // plain tee with crew collar
  | 'hoodie' // open zip hoodie over inner tee (secondary = tee)
  | 'pullover' // closed hoodie with kangaroo pocket & strings
  | 'plaid' // flannel shirt (secondary = check lines)
  | 'polo' // collar + buttons
  | 'blouse' // round collar (secondary = collar)
  | 'sweater' // knit with horizontal stripe (secondary = stripe)
  | 'vest' // sweater vest over shirt (secondary = shirt)
  | 'jacket' // varsity / track jacket (secondary = stripes & inner)
  | 'uniform' // school blazer over white shirt + tie (secondary = tie)
  | 'suit' // business suit (secondary = tie)
  | 'dress' // one-piece dress: bottom becomes a matching skirt
  | 'tank'; // sleeveless top

export type SleeveLength = 'long' | 'short' | 'none';
export type BottomStyle = 'pants' | 'jeans' | 'shorts' | 'skirt';
export type ShoeStyle = 'sneakers' | 'boots' | 'formal';
export type AccessoryType =
  | 'cap'
  | 'backwardsCap'
  | 'beanie'
  | 'glasses'
  | 'sunglasses'
  | 'headphones'
  | 'bow'
  | 'crown';
export type FacialHair = 'none' | 'mustache' | 'beard' | 'stubble';

export interface HairSpec {
  style: HairStyle;
  color?: ColorInput;
  highlight?: ColorInput;
  /** Tip color for long hanging locks (e.g. brown → blonde ombre). */
  ombre?: ColorInput;
}

export interface TopSpec {
  style: TopStyle;
  color: ColorInput;
  secondary?: ColorInput;
  sleeves?: SleeveLength;
}

export interface BottomSpec {
  style: BottomStyle;
  color: ColorInput;
  /** Visible leg color under shorts/skirt (default = skin). Use for tights/socks. */
  legs?: ColorInput;
}

export interface ShoeSpec {
  style?: ShoeStyle;
  color: ColorInput;
  sole?: ColorInput;
}

export interface AccessorySpec {
  type: AccessoryType;
  color?: ColorInput;
  secondary?: ColorInput;
}

export interface CharacterLook {
  skin: ColorInput;
  hair: HairSpec;
  top: TopSpec;
  bottom: BottomSpec;
  shoes: ShoeSpec;
  accessories?: Array<AccessoryType | AccessorySpec>;
  facialHair?: FacialHair;
  facialHairColor?: ColorInput;
  freckles?: boolean;
  blush?: boolean;
  /** Whole-body size multiplier (1 = normal, 0.6 = toddler/baby). Feet stay on the ground. */
  scale?: number;
}

/** Partial look that optionally starts from a preset and overrides parts of it. */
export interface CharacterLookOverride {
  extends?: PresetName;
  skin?: ColorInput;
  hair?: Partial<HairSpec>;
  top?: Partial<TopSpec>;
  bottom?: Partial<BottomSpec>;
  shoes?: Partial<ShoeSpec>;
  accessories?: Array<AccessoryType | AccessorySpec>;
  facialHair?: FacialHair;
  facialHairColor?: ColorInput;
  freckles?: boolean;
  blush?: boolean;
  /** Whole-body size multiplier (1 = normal, 0.6 = toddler/baby). Feet stay on the ground. */
  scale?: number;
}

export type CharacterLookInput = PresetName | CharacterLookOverride;

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

const PRESETS_RAW = {
  // --- Legacy ids (kept so older stories render identically) -------------
  noob: {
    skin: 'light',
    hair: { style: 'bacon', color: 'darkBrown' },
    top: { style: 'hoodie', color: 'teal', secondary: '#111827' },
    bottom: { style: 'pants', color: '#1F2937' },
    shoes: { color: '#292524' },
  },
  bacon: {
    skin: 'fair',
    hair: { style: 'fluffySwept', color: 'blonde' },
    top: { style: 'plaid', color: 'royal', secondary: 'white' },
    bottom: { style: 'pants', color: 'tan' },
    shoes: { color: '#451A03' },
  },
  guest: {
    skin: '#F2D2B6',
    hair: { style: 'spikyAnime', color: 'black' },
    top: { style: 'hoodie', color: 'darkRed', secondary: 'black' },
    bottom: { style: 'pants', color: 'black' },
    shoes: { color: 'red' },
  },
  teacher: {
    skin: '#F5D5B8',
    hair: { style: 'ponytail', color: 'brown' },
    top: { style: 'plaid', color: '#A16207', secondary: 'cream' },
    bottom: { style: 'pants', color: 'charcoal' },
    shoes: { color: 'navy' },
  },
  builderman: {
    skin: 'medium',
    hair: { style: 'grandpa', color: 'white' },
    top: { style: 'plaid', color: 'mustard', secondary: '#1C1917' },
    bottom: { style: 'pants', color: 'navy' },
    shoes: { color: '#111827' },
    facialHair: 'mustache',
  },
  mom: {
    skin: '#F7DFC6',
    hair: { style: 'wavyLong', color: 'brown', highlight: '#6E381D', ombre: '#DFB982' },
    top: { style: 'blouse', color: 'rose', secondary: '#FFE4E6' },
    bottom: { style: 'pants', color: 'blue' },
    shoes: { color: 'navy' },
  },

  // --- Archetypes ----------------------------------------------------------
  kid_boy: {
    skin: 'light',
    hair: { style: 'messyFringe', color: 'brown' },
    top: { style: 'tshirt', color: 'blue' },
    bottom: { style: 'jeans', color: 'denim' },
    shoes: { color: 'white', sole: 'white' },
  },
  kid_girl: {
    skin: 'fair',
    hair: { style: 'pigtails', color: 'blonde' },
    top: { style: 'tshirt', color: 'pink' },
    bottom: { style: 'skirt', color: 'purple' },
    shoes: { color: 'white' },
    accessories: [{ type: 'bow', color: 'pink' }],
    blush: true,
  },
  little_brother: {
    skin: 'light',
    hair: { style: 'curly', color: 'ginger' },
    top: { style: 'pullover', color: 'green', secondary: 'white' },
    bottom: { style: 'shorts', color: 'khaki' },
    shoes: { color: 'red' },
    freckles: true,
  },
  schoolgirl: {
    skin: 'fair',
    hair: { style: 'bob', color: 'black' },
    top: { style: 'uniform', color: 'navy', secondary: 'red' },
    bottom: { style: 'skirt', color: 'charcoal', legs: 'white' },
    shoes: { style: 'formal', color: 'black' },
  },
  schoolboy: {
    skin: 'medium',
    hair: { style: 'sidePart', color: 'darkBrown' },
    top: { style: 'uniform', color: 'navy', secondary: 'red' },
    bottom: { style: 'pants', color: 'charcoal' },
    shoes: { style: 'formal', color: 'black' },
  },
  nerd: {
    skin: 'porcelain',
    hair: { style: 'sidePart', color: 'lightBrown' },
    top: { style: 'vest', color: 'mustard', secondary: 'white' },
    bottom: { style: 'pants', color: 'khaki' },
    shoes: { color: 'brown' },
    accessories: ['glasses'],
  },
  bully: {
    skin: 'tan',
    hair: { style: 'buzz', color: 'black' },
    top: { style: 'jacket', color: 'black', secondary: 'red' },
    bottom: { style: 'jeans', color: 'darkDenim' },
    shoes: { style: 'boots', color: 'black' },
    accessories: [{ type: 'backwardsCap', color: 'red' }],
  },
  cool_kid: {
    skin: 'brown',
    hair: { style: 'curly', color: 'black' },
    top: { style: 'pullover', color: 'orange', secondary: 'black' },
    bottom: { style: 'pants', color: 'black' },
    shoes: { color: 'white' },
    accessories: [{ type: 'headphones', color: 'black', secondary: 'orange' }],
  },
  teen_girl: {
    skin: 'light',
    hair: { style: 'wavyLong', color: 'brown', ombre: 'blonde' },
    top: { style: 'sweater', color: 'lavender', secondary: 'white' },
    bottom: { style: 'jeans', color: 'denim' },
    shoes: { color: 'white' },
  },
  dad: {
    skin: 'medium',
    hair: { style: 'slickBack', color: 'brown' },
    top: { style: 'polo', color: 'navy', secondary: 'white' },
    bottom: { style: 'pants', color: 'khaki' },
    shoes: { color: 'brown' },
    facialHair: 'stubble',
  },
  real_mom: {
    skin: 'fair',
    hair: { style: 'ponytail', color: 'goldenBlonde' },
    top: { style: 'sweater', color: 'rose', secondary: 'cream' },
    bottom: { style: 'jeans', color: 'denim' },
    shoes: { color: 'white' },
  },
  teacher_woman: {
    skin: 'medium',
    hair: { style: 'bun', color: 'auburn' },
    top: { style: 'blouse', color: 'white', secondary: 'cream' },
    bottom: { style: 'skirt', color: 'navy' },
    shoes: { style: 'formal', color: 'black' },
    accessories: ['glasses'],
  },
  teacher_man: {
    skin: 'dark',
    hair: { style: 'buzz', color: 'black' },
    top: { style: 'suit', color: 'charcoal', secondary: 'blue' },
    bottom: { style: 'pants', color: 'charcoal' },
    shoes: { style: 'formal', color: 'black' },
    facialHair: 'beard',
  },
  principal: {
    skin: 'fair',
    hair: { style: 'grandpa', color: 'gray' },
    top: { style: 'suit', color: 'navy', secondary: 'red' },
    bottom: { style: 'pants', color: 'navy' },
    shoes: { style: 'formal', color: 'black' },
    accessories: ['glasses'],
    facialHair: 'mustache',
  },
  grandpa: {
    skin: 'medium',
    hair: { style: 'grandpa', color: 'white' },
    top: { style: 'vest', color: 'brown', secondary: 'cream' },
    bottom: { style: 'pants', color: 'gray' },
    shoes: { color: 'brown' },
    facialHair: 'mustache',
    accessories: ['glasses'],
  },
  grandma: {
    skin: 'fair',
    hair: { style: 'bun', color: 'gray' },
    top: { style: 'sweater', color: 'purple', secondary: 'lavender' },
    bottom: { style: 'skirt', color: 'charcoal' },
    shoes: { style: 'formal', color: 'brown' },
    accessories: ['glasses'],
    blush: true,
  },
  classic_noob: {
    skin: 'classic',
    hair: { style: 'none' },
    top: { style: 'tshirt', color: 'blue', sleeves: 'none' },
    bottom: { style: 'pants', color: '#A3C93A' },
    shoes: { color: '#A3C93A', sole: '#A3C93A' },
  },
} satisfies Record<string, CharacterLook>;

export type PresetName = keyof typeof PRESETS_RAW;
export const CHARACTER_PRESETS: Record<PresetName, CharacterLook> = PRESETS_RAW as Record<PresetName, CharacterLook>;
export const PRESET_NAMES = Object.keys(PRESETS_RAW) as PresetName[];

// ---------------------------------------------------------------------------
// Resolution helpers
// ---------------------------------------------------------------------------

export function resolveColor(c: ColorInput | undefined, fallback = '#FF00FF'): string {
  if (!c) return fallback;
  if (c.startsWith('#')) return c;
  const name = c as string;
  if (name in CLOTH_COLORS) return CLOTH_COLORS[name as ClothColorName];
  if (name in SKIN_TONES) return SKIN_TONES[name as SkinToneName];
  if (name in HAIR_COLORS) return HAIR_COLORS[name as HairColorName].color;
  return c;
}

export function resolveHairColors(h: HairSpec): { color: string; highlight: string; ombre?: string } {
  const named = h.color && !h.color.startsWith('#') && h.color in HAIR_COLORS ? HAIR_COLORS[h.color as HairColorName] : null;
  const color = named ? named.color : resolveColor(h.color, HAIR_COLORS.brown.color);
  const highlight = h.highlight ? resolveColor(h.highlight) : named ? named.highlight : color;
  const ombre = h.ombre ? resolveColor(h.ombre) : undefined;
  return { color, highlight, ombre };
}

export function resolveSkin(c: ColorInput | undefined): string {
  if (c && !c.startsWith('#') && c in SKIN_TONES) return SKIN_TONES[c as SkinToneName];
  return resolveColor(c, SKIN_TONES.light);
}

export function normalizeAccessories(list: CharacterLook['accessories']): AccessorySpec[] {
  return (list ?? []).map((a) => (typeof a === 'string' ? { type: a } : a));
}

/** Build a full look from a preset name, an override object, or nothing. */
export function buildLook(input: CharacterLookInput | undefined, fallbackPreset: PresetName = 'kid_boy'): CharacterLook {
  if (!input) return CHARACTER_PRESETS[fallbackPreset];
  if (typeof input === 'string') return CHARACTER_PRESETS[input] ?? CHARACTER_PRESETS[fallbackPreset];
  const base = CHARACTER_PRESETS[input.extends ?? fallbackPreset];
  const hairColorChanged = input.hair?.color !== undefined && input.hair?.highlight === undefined;
  return {
    ...base,
    ...stripUndefined({
      skin: input.skin,
      accessories: input.accessories,
      facialHair: input.facialHair,
      facialHairColor: input.facialHairColor,
      freckles: input.freckles,
      blush: input.blush,
      scale: input.scale,
    }),
    hair: {
      ...base.hair,
      // a new hair color should not inherit the preset's highlight/ombre tones
      ...(hairColorChanged ? { highlight: undefined, ombre: undefined } : {}),
      ...stripUndefined(input.hair ?? {}),
    },
    top: { ...base.top, ...stripUndefined(input.top ?? {}) },
    bottom: { ...base.bottom, ...stripUndefined(input.bottom ?? {}) },
    shoes: { ...base.shoes, ...stripUndefined(input.shoes ?? {}) },
  };
}

/** Resolve an actor id to a look: story cast entry → preset with same name → fallback. */
export function lookForActor(actorId: string, cast?: Record<string, CharacterLookInput>): CharacterLook {
  const entry = cast?.[actorId];
  if (entry) return buildLook(entry);
  if (actorId in CHARACTER_PRESETS) return CHARACTER_PRESETS[actorId as PresetName];
  return CHARACTER_PRESETS.kid_boy;
}

function stripUndefined<T extends object>(o: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(o)) if (v !== undefined) (out as Record<string, unknown>)[k] = v;
  return out;
}
