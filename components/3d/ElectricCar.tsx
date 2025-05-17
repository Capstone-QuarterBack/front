"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh, Material } from "three";

interface ElectricCarProps {
  position: [number, number, number];
  rotation: [number, number, number];
  isCharging: boolean;
}

export function ElectricCar({
  position,
  rotation = [0, 0, 0],
  isCharging,
}: ElectricCarProps) {
  const groupRef = useRef<Group>(null);
  const chargingEffectRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // 애니메이션 효과
  useFrame((state) => {
    if (!groupRef.current || !chargingEffectRef.current) return;

    // 충전 효과 애니메이션
    if (isCharging) {
      chargingEffectRef.current.visible = true;
      chargingEffectRef.current.scale.y =
        0.8 + Math.sin(state.clock.elapsedTime * 5) * 0.2;

      // material 속성에 접근하기 전에 타입 체크
      const material = chargingEffectRef.current.material as Material & {
        opacity: number;
      };
      if (material && "opacity" in material) {
        material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 5) * 0.4;
      }
    } else {
      chargingEffectRef.current.visible = false;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 차량 본체 */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.5, 0.8]} />
        <meshStandardMaterial
          color={hovered ? "#e0e0e0" : "#d0d0d0"}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* 차량 상단 */}
      <mesh castShadow position={[0, 0.7, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.7]} />
        <meshStandardMaterial
          color={hovered ? "#e0e0e0" : "#d0d0d0"}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* 바퀴 */}
      {[
        [-0.6, 0.2, 0.4],
        [0.6, 0.2, 0.4],
        [-0.6, 0.2, -0.4],
        [0.6, 0.2, -0.4],
      ].map((wheelPos, i) => (
        <mesh
          key={i}
          castShadow
          position={wheelPos as [number, number, number]}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
            <meshStandardMaterial
              color="#333"
              metalness={0.5}
              roughness={0.7}
            />
          </mesh>
        </mesh>
      ))}

      {/* 창문 */}
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.19, 0.39, 0.69]} />
        <meshStandardMaterial
          color="#87CEEB"
          transparent
          opacity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* 충전 효과 */}
      <mesh ref={chargingEffectRef} position={[0, 1.2, 0]} visible={isCharging}>
        <cylinderGeometry args={[0.1, 0.3, 0.8, 16]} />
        <meshBasicMaterial color="#2196F3" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
