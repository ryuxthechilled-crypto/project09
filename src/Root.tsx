import React from 'react';
import { Composition } from 'remotion';
import { RobloxShortComposition } from './RobloxShortComposition';
import { CURRENT_STORY } from './story/currentStory';
import { GALLERY_PAGES, LocationGallery } from './LocationGallery';
import { CharacterLineup, FRAMES_PER_PAGE, LINEUP_PAGES } from './CharacterLineup';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RobloxShort"
        component={RobloxShortComposition}
        durationInFrames={CURRENT_STORY.durationInFrames}
        fps={CURRENT_STORY.fps}
        width={CURRENT_STORY.width}
        height={CURRENT_STORY.height}
      />
      <Composition
        id="CharacterLineup"
        component={CharacterLineup}
        durationInFrames={FRAMES_PER_PAGE * LINEUP_PAGES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LocationGallery"
        component={LocationGallery}
        durationInFrames={GALLERY_PAGES.length}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
