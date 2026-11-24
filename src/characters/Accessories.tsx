import React from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { AccessorySpec, FacialHair, resolveColor } from './look';

/**
 * Head-attached accessories. Coordinates are relative to the head center
 * (head radius 0.62, top at y=+0.575, face toward +Z, eyes at y≈0.04, x≈±0.17).
 */

const Cap: React.FC<{ color: string; secondary: string; backwards?: boolean }> = ({ color, secondary, backwards }) => (
  <group rotation={[0, backwards ? Math.PI : 0, 0]}>
    <mesh position={[0, 0.44, -0.04]} scale={[1.0, 0.8, 1.02]} castShadow>
      <sphereGeometry args={[0.82, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} roughness={0.6} side={THREE.DoubleSide} />
    </mesh>
    {/* band */}
    <mesh position={[0, 0.46, -0.04]}>
      <cylinderGeometry args={[0.83, 0.83, 0.08, 28, 1, true]} />
      <meshStandardMaterial color={secondary} roughness={0.6} side={THREE.DoubleSide} />
    </mesh>
    {/* brim */}
    <RoundedBox position={[0, 0.45, 0.98]} rotation={[0.12, 0, 0]} args={[1.2, 0.06, 0.62]} radius={0.025} castShadow>
      <meshStandardMaterial color={secondary} roughness={0.6} />
    </RoundedBox>
    {/* button */}
    <mesh position={[0, 1.1, -0.04]}>
      <sphereGeometry args={[0.07, 10, 8]} />
      <meshStandardMaterial color={secondary} roughness={0.6} />
    </mesh>
  </group>
);

const Beanie: React.FC<{ color: string; secondary: string }> = ({ color, secondary }) => (
  <group>
    <mesh position={[0, 0.46, -0.03]} scale={[1.0, 0.92, 1.02]} castShadow>
      <sphereGeometry args={[0.76, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} roughness={0.85} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0.5, -0.03]} castShadow>
      <cylinderGeometry args={[0.8, 0.8, 0.26, 28]} />
      <meshStandardMaterial color={secondary} roughness={0.85} />
    </mesh>
    <mesh position={[0, 1.2, -0.03]} castShadow>
      <sphereGeometry args={[0.17, 12, 10]} />
      <meshStandardMaterial color={secondary} roughness={0.95} />
    </mesh>
  </group>
);

const Glasses: React.FC<{ color: string; dark?: boolean }> = ({ color, dark }) => (
  <group position={[0, 0.03, 0]}>
    {[-1, 1].map((s) => (
      <group key={s} position={[s * 0.19, 0, 0.655]} rotation={[0, s * 0.22, 0]}>
        {dark ? (
          <RoundedBox args={[0.32, 0.2, 0.03]} radius={0.05}>
            <meshStandardMaterial color="#0A0A0A" roughness={0.15} metalness={0.4} />
          </RoundedBox>
        ) : (
          <>
            <mesh>
              <torusGeometry args={[0.13, 0.022, 8, 24]} />
              <meshStandardMaterial color={color} roughness={0.35} metalness={0.3} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.13, 20]} />
              <meshStandardMaterial color="#DBEAFE" transparent opacity={0.22} roughness={0.05} />
            </mesh>
          </>
        )}
      </group>
    ))}
    {/* bridge */}
    <mesh position={[0, 0.03, 0.665]}>
      <boxGeometry args={[0.12, 0.03, 0.03]} />
      <meshStandardMaterial color={dark ? '#0A0A0A' : color} />
    </mesh>
    {/* temples */}
    {[-1, 1].map((s) => (
      <group key={`t${s}`}>
        <mesh position={[s * 0.45, 0.03, 0.56]} rotation={[0, s * -0.75, 0]}>
          <boxGeometry args={[0.03, 0.03, 0.34]} />
          <meshStandardMaterial color={dark ? '#0A0A0A' : color} />
        </mesh>
        <mesh position={[s * 0.6, 0.03, 0.18]}>
          <boxGeometry args={[0.03, 0.03, 0.56]} />
          <meshStandardMaterial color={dark ? '#0A0A0A' : color} />
        </mesh>
      </group>
    ))}
  </group>
);

const Headphones: React.FC<{ color: string; secondary: string }> = ({ color, secondary }) => (
  <group position={[0, 0.12, -0.04]}>
    <mesh>
      <torusGeometry args={[0.84, 0.065, 10, 32, Math.PI]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
    {[-1, 1].map((s) => (
      <group key={s} position={[s * 0.8, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.27, 0.27, 0.2, 20]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
        <mesh position={[0, s * 0.11, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.03, 20]} />
          <meshStandardMaterial color={secondary} roughness={0.4} emissive={secondary} emissiveIntensity={0.2} />
        </mesh>
      </group>
    ))}
  </group>
);

const Bow: React.FC<{ color: string }> = ({ color }) => (
  <group position={[0.42, 0.86, 0.05]} rotation={[0, 0, -0.35]}>
    {[-1, 1].map((s) => (
      <mesh key={s} position={[s * 0.17, 0, 0]} rotation={[0, 0, (s * Math.PI) / 2]} castShadow>
        <coneGeometry args={[0.15, 0.32, 4]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
    ))}
    <mesh>
      <sphereGeometry args={[0.08, 10, 8]} />
      <meshStandardMaterial color={color} roughness={0.45} />
    </mesh>
  </group>
);

const Crown: React.FC<{ color: string }> = ({ color }) => (
  <group position={[0, 0.9, -0.04]}>
    <mesh castShadow>
      <cylinderGeometry args={[0.5, 0.46, 0.22, 24, 1, true]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.25} side={THREE.DoubleSide} />
    </mesh>
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
      const a = (i / 8) * Math.PI * 2;
      return (
        <mesh key={i} position={[Math.sin(a) * 0.48, 0.2, Math.cos(a) * 0.48]} castShadow>
          <coneGeometry args={[0.08, 0.22, 6]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.25} />
        </mesh>
      );
    })}
  </group>
);

export const HeadAccessory: React.FC<{ spec: AccessorySpec }> = ({ spec }) => {
  const defaults: Record<string, [string, string]> = {
    cap: ['#DC2626', '#F8FAFC'],
    backwardsCap: ['#2563EB', '#F8FAFC'],
    beanie: ['#334155', '#64748B'],
    glasses: ['#18181B', '#18181B'],
    sunglasses: ['#0A0A0A', '#0A0A0A'],
    headphones: ['#18181B', '#38BDF8'],
    bow: ['#EC4899', '#EC4899'],
    crown: ['#FACC15', '#FACC15'],
  };
  const [d1, d2] = defaults[spec.type] ?? ['#888888', '#FFFFFF'];
  const color = resolveColor(spec.color, d1);
  const secondary = resolveColor(spec.secondary, spec.color && spec.type !== 'cap' && spec.type !== 'backwardsCap' ? color : d2);

  switch (spec.type) {
    case 'cap':
      return <Cap color={color} secondary={secondary} />;
    case 'backwardsCap':
      return <Cap color={color} secondary={secondary} backwards />;
    case 'beanie':
      return <Beanie color={color} secondary={spec.secondary ? secondary : new THREE.Color(color).multiplyScalar(0.75).getStyle()} />;
    case 'glasses':
      return <Glasses color={color} />;
    case 'sunglasses':
      return <Glasses color={color} dark />;
    case 'headphones':
      return <Headphones color={color} secondary={secondary} />;
    case 'bow':
      return <Bow color={color} />;
    case 'crown':
      return <Crown color={color} />;
    default:
      return null;
  }
};

/** True when the accessory sits on top of the head (hair gets flattened under it). */
export function isHat(spec: AccessorySpec): boolean {
  return spec.type === 'cap' || spec.type === 'backwardsCap' || spec.type === 'beanie';
}

export const FacialHairMesh: React.FC<{ type: FacialHair; color: string }> = ({ type, color }) => {
  if (type === 'mustache') {
    return (
      <group position={[0, -0.08, 0.64]}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.14, 0, 0]} rotation={[0, 0, s * -0.25]} scale={[1.2, 0.65, 0.6]} castShadow>
            <sphereGeometry args={[0.16, 12, 10]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
        ))}
      </group>
    );
  }
  if (type === 'beard') {
    return (
      <group>
        {/* jaw wrap */}
        <mesh position={[0, -0.44, 0]}>
          <cylinderGeometry args={[0.65, 0.58, 0.26, 28, 1, true, -Math.PI * 0.5, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* chin */}
        <mesh position={[0, -0.52, 0.46]} scale={[1.25, 0.6, 0.7]} castShadow>
          <sphereGeometry args={[0.24, 14, 10]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
        {/* mustache */}
        <group position={[0, -0.04, 0.63]}>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.12, 0, 0]} rotation={[0, 0, s * -0.2]} scale={[1.1, 0.42, 0.45]}>
              <sphereGeometry args={[0.15, 12, 10]} />
              <meshStandardMaterial color={color} roughness={0.85} />
            </mesh>
          ))}
        </group>
      </group>
    );
  }
  return null; // stubble is painted on the face texture
};
