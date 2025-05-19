"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, useTexture } from "@react-three/drei"
import type { Group, MeshStandardMaterial } from "three"
import type { Charger } from "./StationVisualization"

interface ChargingStationProps {
  position: [number, number, number]
  status: "active" | "disabled" | "maintenance"
  chargers: Charger[]
  onClick: () => void
  onChargerClick: (charger: Charger) => void
  isSelected: boolean
  selectedChargerId?: string | null
}

export function ChargingStation({
  position,
  status,
  chargers,
  onClick,
  onChargerClick,
  isSelected,
  selectedChargerId,
}: ChargingStationProps) {
  const groupRef = useRef<Group>(null)
  const baseMaterialRef = useRef<MeshStandardMaterial>(null)
  const roofMaterialRef = useRef<MeshStandardMaterial>(null)
  const [hovered, setHovered] = useState(false)

  // 세종대학교 로고 텍스처 로드
  const logoTexture = useTexture("/images/sejong-university-logo.png")

  // 상태에 따른 색상 설정
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "#4CAF50" // 녹색
      case "disabled":
        return "#F44336" // 빨간색
      case "maintenance":
        return "#FFC107" // 노란색
      default:
        return "#4CAF50"
    }
  }

  // 충전기 상태에 따른 색상 설정
  const getChargerStatusColor = (chargerStatus: string) => {
    switch (chargerStatus) {
      case "available":
        return "#4CAF50" // 녹색 - 이용가능
      case "charging":
        return "#2196F3" // 파란색 - 이용중
      case "disabled":
        return "#F44336" // 빨간색 - 사용불가
      case "maintenance":
        return "#FFC107" // 노란색 - 점검중
      default:
        return "#9E9E9E" // 회색
    }
  }

  // 충전기 상태에 따른 텍스트 설정
  const getChargerStatusText = (chargerStatus: string) => {
    switch (chargerStatus) {
      case "available":
        return "이용가능"
      case "charging":
        return "충전중"
      case "disabled":
        return "사용불가"
      case "maintenance":
        return "점검중"
      default:
        return "상태미상"
    }
  }

  // 애니메이션 및 상호작용 효과
  useFrame((state, delta) => {
    if (!groupRef.current) return

    // 선택되었을 때 약간 위로 올라가는 효과
    if (isSelected) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05 + 0.1
    } else {
      groupRef.current.position.y = position[1]
    }

    // 호버 효과
    if (baseMaterialRef.current && roofMaterialRef.current) {
      if (hovered || isSelected) {
        baseMaterialRef.current.emissiveIntensity = 0.3
        roofMaterialRef.current.emissiveIntensity = 0.3
      } else {
        baseMaterialRef.current.emissiveIntensity = 0
        roofMaterialRef.current.emissiveIntensity = 0
      }
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 충전소 기본 구조 */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial
          ref={baseMaterialRef}
          color={getStatusColor()}
          emissive={getStatusColor()}
          emissiveIntensity={0}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* 충전소 지붕 */}
      <mesh castShadow position={[0, 1.25, 0]}>
        <boxGeometry args={[2.5, 0.5, 2.5]} />
        <meshStandardMaterial
          ref={roofMaterialRef}
          color="#2196F3"
          emissive="#2196F3"
          emissiveIntensity={0}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* 세종대학교 로고 - 앞면 */}
      <mesh position={[0, 0.5, 1.01]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={logoTexture} transparent opacity={1} />
      </mesh>

      {/* 세종대학교 로고 - 뒷면 */}
      <mesh position={[0, 0.5, -1.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={logoTexture} transparent opacity={1} />
      </mesh>

      {/* 충전기 렌더링 */}
      {chargers.map((charger) => (
        <group
          key={charger.id}
          position={charger.position}
          onClick={(e) => {
            e.stopPropagation()
            onChargerClick(charger)
          }}
        >
          {/* 충전기 기둥 */}
          <mesh castShadow position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
            <meshStandardMaterial
              color={getChargerStatusColor(charger.status)}
              metalness={0.8}
              roughness={0.2}
              emissive={getChargerStatusColor(charger.status)}
              emissiveIntensity={selectedChargerId === charger.id ? 0.5 : 0}
            />
          </mesh>

          {/* 충전기 헤드 */}
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#424242" metalness={0.5} roughness={0.5} />
          </mesh>

          {/* 충전기 선택 표시기 */}
          {selectedChargerId === charger.id && (
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.2, 0.25, 32]} />
              <meshBasicMaterial color="#FFEB3B" transparent opacity={0.7} />
            </mesh>
          )}

          {/* 충전기 상태 표시 */}
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {charger.name}
          </Text>

          {/* 충전기 상태 텍스트 */}
          <Text
            position={[0, 0.95, 0]}
            fontSize={0.08}
            color={getChargerStatusColor(charger.status)}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {getChargerStatusText(charger.status)}
          </Text>
        </group>
      ))}

      {/* 충전소 이름 */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {status === "active" ? "세종대학교 충전소" : status === "disabled" ? "충전 금지" : "점검 중"}
      </Text>

      {/* 상태 표시기 */}
      <mesh position={[0, 0.5, 1.1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshBasicMaterial color={getStatusColor()} />
      </mesh>

      {/* 선택 표시기 */}
      {isSelected && (
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.3, 32]} />
          <meshBasicMaterial color="#FFEB3B" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  )
}
