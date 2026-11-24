import React from 'react';
import * as THREE from 'three';
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import { CharacterId, CharacterKeyframe, CameraShot, RobloxShortStory } from './types/schema';
import { R6Character } from './components/R6Character';
import { EnvironmentSwitch } from './environments/Environments';
import { ShortsHUD } from './components/ShortsHUD';
import { CURRENT_STORY } from './story/currentStory';
import { lookForActor } from './characters/look';
import { LOCATION_INFO } from './environments/locations';
import { CANVAS_SCALE, SHADOWS } from './renderQuality';

function evaluateCharacterKeyframes(keyframes: CharacterKeyframe[], frame: number): CharacterKeyframe {
  if (keyframes.length === 1 || frame <= keyframes[0].frame) {
    return keyframes[0];
  }
  const last = keyframes[keyframes.length - 1];
  if (frame >= last.frame) {
    return last;
  }

  for (let i = 0; i < keyframes.length - 1; i++) {
    const k0 = keyframes[i];
    const k1 = keyframes[i + 1];
    if (frame >= k0.frame && frame <= k1.frame) {
      const span = Math.max(1, k1.frame - k0.frame);
      const t = (frame - k0.frame) / span;
      return {
        frame,
        position: [
          THREE.MathUtils.lerp(k0.position[0], k1.position[0], t),
          THREE.MathUtils.lerp(k0.position[1], k1.position[1], t),
          THREE.MathUtils.lerp(k0.position[2], k1.position[2], t),
        ],
        rotationY: THREE.MathUtils.lerp(k0.rotationY, k1.rotationY, t),
        rotationX: THREE.MathUtils.lerp(k0.rotationX ?? 0, k1.rotationX ?? 0, t),
        rotationZ: THREE.MathUtils.lerp(k0.rotationZ ?? 0, k1.rotationZ ?? 0, t),
        anim: k0.anim,
        expression: k0.expression,
        prop: k0.prop,
        chatBubble: k0.chatBubble,
      };
    }
  }

  return last;
}

const CameraRig: React.FC<{ shots: CameraShot[]; frame: number }> = ({ shots, frame }) => {
  const { camera } = useThree();

  const activeShot =
    shots.find((s) => frame >= s.startFrame && frame <= s.endFrame) ||
    shots[shots.length - 1];

  const progress = interpolate(
    frame,
    [activeShot.startFrame, Math.max(activeShot.startFrame + 1, activeShot.endFrame)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const shakeAmp = activeShot.shake ?? 0;
  const shakeX = shakeAmp ? Math.sin(frame * 1.9) * shakeAmp : 0;
  const shakeY = shakeAmp ? Math.cos(frame * 2.3) * shakeAmp : 0;

  const camX = THREE.MathUtils.lerp(activeShot.fromPos[0], activeShot.toPos[0], progress) + shakeX;
  const camY = THREE.MathUtils.lerp(activeShot.fromPos[1], activeShot.toPos[1], progress) + shakeY;
  const camZ = THREE.MathUtils.lerp(activeShot.fromPos[2], activeShot.toPos[2], progress);

  const targetX = THREE.MathUtils.lerp(activeShot.fromTarget[0], activeShot.toTarget[0], progress);
  const targetY = THREE.MathUtils.lerp(activeShot.fromTarget[1], activeShot.toTarget[1], progress);
  const targetZ = THREE.MathUtils.lerp(activeShot.fromTarget[2], activeShot.toTarget[2], progress);

  camera.position.set(camX, camY, camZ);
  if ('fov' in camera && activeShot.fov) {
    (camera as THREE.PerspectiveCamera).fov = activeShot.fov;
    camera.updateProjectionMatrix();
  }
  camera.lookAt(targetX, targetY, targetZ);

  return null;
};

export const RobloxShortComposition: React.FC<{ story?: RobloxShortStory }> = ({
  story = CURRENT_STORY,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const currentScene =
    story.scenes.find((s) => frame >= s.startFrame && frame < s.endFrame) ||
    story.scenes[story.scenes.length - 1];

  const exterior = LOCATION_INFO[currentScene.location]?.exterior ?? false;
  const overview = currentScene.location === 'town_overview';
  const skyColor = currentScene.skyColor || (currentScene.isNight ? '#090D16' : exterior ? '#38BDF8' : '#1E293B');
  const fogRange: [number, number] = overview ? [140, 360] : exterior ? [55, 190] : [26, 68];

  const canvasWidth = Math.max(2, Math.round(width * CANVAS_SCALE));
  const canvasHeight = Math.max(2, Math.round(height * CANVAS_SCALE));
  const upscale = canvasWidth === width ? 1 : width / canvasWidth;

  return (
    <AbsoluteFill style={{ backgroundColor: skyColor }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: canvasWidth,
          height: canvasHeight,
          transform: upscale === 1 ? undefined : `scale(${upscale})`,
          transformOrigin: 'top left',
        }}
      >
        <ThreeCanvas
          width={canvasWidth}
          height={canvasHeight}
          shadows={SHADOWS}
          camera={{ fov: 46, near: 0.1, far: 500, position: [0, 5, 10] }}
        >
        <color attach="background" args={[skyColor]} />
        <fog attach="fog" args={[skyColor, fogRange[0], fogRange[1]]} />

        {/* Dynamic Camera Rig */}
        <CameraRig shots={currentScene.cameraShots} frame={frame} />

        {/* Roblox Studio Style Lighting */}
        <ambientLight
          intensity={currentScene.isNight ? 0.55 : 0.85}
          color={currentScene.isNight ? '#94A3B8' : '#F8FAFC'}
        />
        <hemisphereLight args={['#FFFFFF', '#334155', 0.65]} position={[0, 25, 0]} />
        <directionalLight
          key={overview ? 'sun-overview' : exterior ? 'sun-exterior' : 'sun-interior'}
          position={overview ? [60, 110, 70] : exterior ? [24, 44, 28] : [12, 22, 14]}
          intensity={currentScene.isNight ? 1.1 : 2.1}
          color={currentScene.isNight ? '#CBD5E1' : '#FFFBEB'}
          castShadow={SHADOWS}
          shadow-mapSize-width={overview ? 2048 : 1024}
          shadow-mapSize-height={overview ? 2048 : 1024}
          shadow-camera-left={overview ? -110 : exterior ? -30 : -18}
          shadow-camera-right={overview ? 110 : exterior ? 30 : 18}
          shadow-camera-top={overview ? 110 : exterior ? 30 : 18}
          shadow-camera-bottom={overview ? -110 : exterior ? -30 : -18}
          shadow-camera-far={overview ? 260 : 120}
          shadow-bias={-0.0004}
        />

        {/* Active 3D location (town anchor or interior set) */}
        <EnvironmentSwitch
          location={currentScene.location}
          isNight={currentScene.isNight}
          variant={currentScene.variant}
          boardText={currentScene.boardText}
          schoolName={currentScene.schoolName}
        />

        {/* Active R6 Characters in Scene */}
        {(Object.entries(currentScene.characters) as [CharacterId, CharacterKeyframe[]][]).map(
          ([charId, keyframes]) => {
            if (!keyframes || keyframes.length === 0) return null;
            const state = evaluateCharacterKeyframes(keyframes, frame);
            return (
              <R6Character
                key={charId}
                look={lookForActor(charId, story.cast)}
                position={state.position}
                rotationY={state.rotationY}
                rotationX={state.rotationX}
                rotationZ={state.rotationZ}
                anim={state.anim}
                expression={state.expression}
                prop={state.prop}
              />
            );
          }
        )}
      </ThreeCanvas>
      </div>

      {/* 2D Shorts Captions, Leaderboard & Chat Bubbles */}
      <ShortsHUD story={story} />

      {/* Voice + music + SFX, mixed by scripts/generate-kokoro-tts.py */}
      <Audio src={staticFile('soundtrack.wav')} />
    </AbsoluteFill>
  );
};
