import type { CharacterLookInput, PresetName } from '../characters/look';

/**
 * Actor id used as a key in `scene.characters`. Either a preset name
 * (see CHARACTER_PRESETS in src/characters/look.ts) or any custom name declared in `story.cast`.
 */
export type CharacterId = PresetName | (string & {});

export type ExpressionId =
  | 'smile'
  | 'shocked'
  | 'sleeping'
  | 'panic'
  | 'angry'
  | 'cool'
  | 'laugh'
  | 'deadpan';

export type AnimationMode =
  | 'idle'
  | 'sleep'
  | 'walk'
  | 'sprint'
  | 'jump'
  | 'wave'
  | 'point'
  | 'dance'
  | 'knocked'
  | 'panting'
  | 'celebrate';

import type { HouseVariantId, LocationId } from '../environments/locations';
export type { HouseVariantId, LocationId };

export type PropId =
  | 'none'
  | 'backpack'
  | 'bloxy_cola'
  | 'pointer'
  | 'pan'
  | 'clipboard'
  | 'hammer'
  | 'wood_plank'
  | 'binoculars'
  | 'halo_gold'
  | 'halo_red'
  | 'creepy_shadow'
  | 'counter_high'
  | 'counter_mid'
  | 'counter_bully'
  | 'counter_3'
  | 'counter_2'
  | 'counter_1'
  | 'counter_0'
  | 'counter_100'
  | 'counter_99'
  | 'counter_98'
  | 'counter_50'
  | 'counter_12'
  | 'mouth_tape';

export interface CharacterKeyframe {
  frame: number;
  position: [number, number, number];
  rotationY: number;
  rotationX?: number;
  rotationZ?: number;
  anim: AnimationMode;
  expression: ExpressionId;
  prop?: PropId;
  chatBubble?: string;
}

export interface CameraShot {
  startFrame: number;
  endFrame: number;
  fromPos: [number, number, number];
  toPos: [number, number, number];
  fromTarget: [number, number, number];
  toTarget: [number, number, number];
  fov?: number;
  shake?: number;
}

export interface CaptionCue {
  startFrame: number;
  endFrame: number;
  speaker?: string;
  speakerColor?: string;
  text: string;
  sfxBadge?: string;
}

export interface SceneSegment {
  id: string;
  location: LocationId;
  /** Which hero house / family home: 'blue' | 'yellow' | 'red' | 'white' | 'green' (house, living_room, kitchen, bedroom). */
  variant?: HouseVariantId;
  /** Up to 4 chalkboard lines for the classroom. */
  boardText?: string[];
  /** Name on the school sign (school_exterior). */
  schoolName?: string;
  locationLabel?: string;
  skyColor?: string;
  isNight?: boolean;
  startFrame: number;
  endFrame: number;
  cameraShots: CameraShot[];
  characters: Partial<Record<CharacterId, CharacterKeyframe[]>>;
}

export interface RobloxShortStory {
  title: string;
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  /** Character constructor: actor id → preset name or { extends?, hair, top, bottom, ... } overrides. */
  cast?: Record<string, CharacterLookInput>;
  scenes: SceneSegment[];
  captions: CaptionCue[];
}
