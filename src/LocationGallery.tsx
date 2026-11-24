import React from 'react';
import { RobloxShortComposition } from './RobloxShortComposition';
import { LOCATION_INFO, LocationId, HouseVariantId } from './environments/locations';
import { CharacterKeyframe, RobloxShortStory, SceneSegment } from './types/schema';

/**
 * One frame per location page (1080×1920), rendered through the real short composition
 * with each location's default camera and two sample actors for scale.
 *   npx.cmd remotion render src/index.ts LocationGallery out/locations --sequence --image-format=png --gl=angle
 */

interface Page {
  location: LocationId;
  variant?: HouseVariantId;
  night?: boolean;
  label?: string;
}

export const GALLERY_PAGES: Page[] = [
  { location: 'town_overview' },
  { location: 'street' },
  { location: 'crossroads' },
  { location: 'school_exterior' },
  { location: 'house', variant: 'blue' },
  { location: 'house', variant: 'yellow' },
  { location: 'house', variant: 'red' },
  { location: 'house', variant: 'white' },
  { location: 'house', variant: 'green' },
  { location: 'shop' },
  { location: 'playground' },
  { location: 'classroom' },
  { location: 'hallway' },
  { location: 'living_room', variant: 'blue' },
  { location: 'kitchen', variant: 'yellow' },
  { location: 'bedroom', variant: 'red' },
  { location: 'street', night: true, label: 'Main Street (night)' },
  { location: 'house', variant: 'blue', night: true, label: 'Blue house (night)' },
  { location: 'bedroom', variant: 'blue', night: true, label: 'Bedroom (night)' },
];

const kf = (pos: [number, number, number], ry: number, expression: CharacterKeyframe['expression']): CharacterKeyframe[] => [
  { frame: 0, position: pos, rotationY: ry, anim: 'idle', expression },
];

const scenes: SceneSegment[] = GALLERY_PAGES.map((pg, i) => {
  const info = LOCATION_INFO[pg.location];
  return {
    id: `gallery-${i}`,
    location: pg.location,
    variant: pg.variant,
    isNight: pg.night,
    startFrame: i,
    endFrame: i + 1,
    cameraShots: [
      {
        startFrame: i,
        endFrame: i + 1,
        fromPos: info.camera.pos,
        toPos: info.camera.pos,
        fromTarget: info.camera.target,
        toTarget: info.camera.target,
        fov: info.camera.fov,
      },
    ],
    characters:
      pg.location === 'town_overview'
        ? {}
        : { kid_boy: kf([-2.2, 0, 1], 0.2, 'smile'), kid_girl: kf([2.2, 0, 1], -0.2, 'laugh') },
  };
});

export const GALLERY_STORY: RobloxShortStory = {
  title: 'Location gallery',
  fps: 30,
  durationInFrames: GALLERY_PAGES.length,
  width: 1080,
  height: 1920,
  scenes,
  captions: GALLERY_PAGES.map((pg, i) => ({
    startFrame: i,
    endFrame: i,
    text:
      pg.label ??
      (pg.variant && pg.location === 'house' ? `${pg.variant} house` : LOCATION_INFO[pg.location].label) +
        (pg.variant && pg.location !== 'house' ? ` (${pg.variant})` : ''),
  })),
};

export const LocationGallery: React.FC = () => <RobloxShortComposition story={GALLERY_STORY} />;
