import type { V3 } from './kit';

/**
 * Location catalogue. Every location has its stage at the local origin:
 * actors around x ∈ [−6, 6], z ∈ [−3, 4], camera on +Z looking toward −Z.
 * `camera` is a good default establishing shot for a 1080×1920 vertical frame.
 */

export type LocationId =
  // exteriors (one shared town map, see environments/town/TownMap.tsx)
  | 'town_overview'
  | 'street'
  | 'crossroads'
  | 'school_exterior'
  | 'house' // front yard of a hero house → pick with scene.variant
  | 'shop'
  | 'playground'
  // interiors
  | 'classroom'
  | 'hallway'
  | 'living_room' // scene.variant = which family's home
  | 'kitchen'
  | 'bedroom';

export type HouseVariantId = 'blue' | 'yellow' | 'red' | 'white' | 'green';

export interface LocationInfo {
  exterior: boolean;
  label: string;
  camera: { pos: V3; target: V3; fov: number };
  notes: string;
}

const STD_CAM = { pos: [0, 8, 21] as V3, target: [0, 4.6, -2] as V3, fov: 55 };
const ROOM_CAM = { pos: [0, 8.5, 20] as V3, target: [0, 5, -3] as V3, fov: 58 };

export const LOCATION_INFO: Record<LocationId, LocationInfo> = {
  town_overview: {
    exterior: true,
    label: 'Town (aerial)',
    camera: { pos: [-10, 62, 74], target: [8, 0, -6], fov: 55 },
    notes: 'Establishing aerial shot of the whole town for the "In this town..." hook. No actors needed.',
  },
  street: {
    exterior: true,
    label: 'Main Street',
    camera: STD_CAM,
    notes: 'North sidewalk of Main St in front of the blue house; road toward the camera, crossroads to the right (+X).',
  },
  crossroads: {
    exterior: true,
    label: 'Crossroads',
    camera: { pos: [0, 7, 20], target: [0, 5, -6], fov: 55 },
    notes: 'North crosswalk of Main St × Maple Ave; Maple Ave recedes behind the actors, school on the right.',
  },
  school_exterior: {
    exterior: true,
    label: 'School (outside)',
    camera: { pos: [0, 8, 22], target: [0, 7, -8], fov: 58 },
    notes: 'Schoolyard in front of the entrance steps; flagpole left, bike rack right, bus on the side.',
  },
  house: {
    exterior: true,
    label: 'Hero house (front yard)',
    camera: { pos: [0, 8, 22], target: [0, 6.5, -6], fov: 58 },
    notes: 'Front yard of the house picked by scene.variant (blue, yellow, red, white, green). Front door ≈ z −4.',
  },
  shop: {
    exterior: true,
    label: 'RoMart shop',
    camera: STD_CAM,
    notes: 'Sidewalk in front of the corner shop (storefront ≈ z −4), vending machine on the left.',
  },
  playground: {
    exterior: true,
    label: 'Town park',
    camera: { pos: [0, 8, 21], target: [0, 4.5, -3], fov: 58 },
    notes: 'Inside the fenced playground: slide tower, swings, sandbox, seesaw. Gate is behind the camera.',
  },
  classroom: {
    exterior: false,
    label: 'Classroom',
    camera: ROOM_CAM,
    notes: 'Chalkboard (scene.boardText) on the back wall, teacher desk left, student desks on both sides of a center aisle.',
  },
  hallway: {
    exterior: false,
    label: 'School hallway',
    camera: ROOM_CAM,
    notes: 'Lockers along the back wall, ROOM 101 door center, trophy case right, bulletin board left.',
  },
  living_room: {
    exterior: false,
    label: 'Living room',
    camera: ROOM_CAM,
    notes: 'Sofa against the back wall facing camera, TV on the left wall, coffee table at z ≈ −1.4. Palette from scene.variant.',
  },
  kitchen: {
    exterior: false,
    label: 'Kitchen',
    camera: ROOM_CAM,
    notes: 'Counters, sink and stove along the back wall, fridge back-left, dining table right (x ≈ 8). Palette from scene.variant.',
  },
  bedroom: {
    exterior: false,
    label: 'Kid bedroom',
    camera: ROOM_CAM,
    notes: 'Bed back-left (top of mattress y ≈ 2.1), gaming desk back-right, wardrobe on the right wall. Palette from scene.variant.',
  },
};

export const isExterior = (l: LocationId) => LOCATION_INFO[l].exterior;
