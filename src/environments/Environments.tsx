import React from 'react';
import { HouseVariantId, LocationId } from '../types/schema';
import { TownExterior } from './town/TownMap';
import {
  BedroomEnvironment,
  ClassroomEnvironment,
  HallwayEnvironment,
  KitchenEnvironment,
  LivingRoomEnvironment,
} from './interiors';

/** Picks the 3D set for a scene. Exteriors are anchors into one shared town map. */
export const EnvironmentSwitch: React.FC<{
  location: LocationId;
  isNight?: boolean;
  variant?: HouseVariantId;
  boardText?: string[];
  schoolName?: string;
}> = ({ location, isNight = false, variant = 'blue', boardText, schoolName }) => {
  switch (location) {
    case 'classroom':
      return <ClassroomEnvironment night={isNight} boardText={boardText} />;
    case 'hallway':
      return <HallwayEnvironment night={isNight} />;
    case 'living_room':
      return <LivingRoomEnvironment variant={variant} night={isNight} />;
    case 'kitchen':
      return <KitchenEnvironment variant={variant} night={isNight} />;
    case 'bedroom':
      return <BedroomEnvironment variant={variant} night={isNight} />;
    default:
      return <TownExterior location={location} variant={variant} night={isNight} schoolName={schoolName} />;
  }
};
