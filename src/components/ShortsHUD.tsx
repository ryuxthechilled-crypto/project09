import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { RobloxShortStory } from '../types/schema';

export const ShortsHUD: React.FC<{ story: RobloxShortStory }> = ({ story }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentCaption = story.captions.find(
    (c) => frame >= c.startFrame && frame <= c.endFrame
  );

  // Fast pop-in spring for word-by-word / short-phrase subtitle (matching reference shorts)
  const captionLocalFrame = currentCaption ? Math.max(0, frame - currentCaption.startFrame) : 0;
  const pop = spring({
    frame: captionLocalFrame,
    fps,
    config: { damping: 14, stiffness: 280, mass: 0.45 },
  });

  const scale = interpolate(pop, [0, 1], [0.86, 1.0]);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        fontFamily: "'Inter', 'Segoe UI', 'Arial Black', sans-serif",
      }}
    >
      {currentCaption && (
        <div
          style={{
            position: 'absolute',
            left: 60,
            right: 60,
            top: '68%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `scale(${scale})`,
          }}
        >
          <div
            style={{
              color: '#FFFFFF',
              fontSize: 76,
              fontWeight: 900,
              textAlign: 'center',
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              WebkitTextStroke: '15px #000000',
              paintOrder: 'stroke fill',
              textShadow: '0 8px 24px rgba(0, 0, 0, 0.85)',
              padding: '8px 16px',
            }}
          >
            {currentCaption.text}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
