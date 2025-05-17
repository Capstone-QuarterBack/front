"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import type { StationOverviewData } from "@/services/api"
import { StationDetailModal } from "./StationDetailModal"

interface SimpleMapProps {
  stations: StationOverviewData[]
  onSelectStation: (station: StationOverviewData) => void
  selectedStation: StationOverviewData | null
}

export function SimpleMap({ stations, onSelectStation, selectedStation }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 })
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [infoWindow, setInfoWindow] = useState<{ x: number; y: number; station: StationOverviewData } | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // 지도 크기 설정
  useEffect(() => {
    if (mapRef.current) {
      const { width, height } = mapRef.current.getBoundingClientRect()
      setMapSize({ width, height })
    }

    const handleResize = () => {
      if (mapRef.current) {
        const { width, height } = mapRef.current.getBoundingClientRect()
        setMapSize({ width, height })
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 지도 초기화 및 충전소 위치 계산
  useEffect(() => {
    if (stations.length === 0 || mapSize.width === 0) return

    // 위도, 경도 범위 계산
    let minLat = Number.MAX_VALUE
    let maxLat = Number.MIN_VALUE
    let minLng = Number.MAX_VALUE
    let maxLng = Number.MIN_VALUE

    stations.forEach((station) => {
      minLat = Math.min(minLat, station.latitude)
      maxLat = Math.max(maxLat, station.latitude)
      minLng = Math.min(minLng, station.longitude)
      maxLng = Math.max(maxLng, station.longitude)
    })

    // 여백 추가
    const padding = 0.1
    const latRange = (maxLat - minLat) * (1 + padding)
    const lngRange = (maxLng - minLng) * (1 + padding)

    // 중심점 계산
    const centerLat = (minLat + maxLat) / 2
    const centerLng = (minLng + maxLng) / 2

    // 스케일 계산 (지도 크기에 맞게)
    const latScale = mapSize.height / latRange
    const lngScale = mapSize.width / lngRange
    const newScale = Math.min(latScale, lngScale) * 0.8

    setScale(newScale)
    setOffset({
      x: mapSize.width / 2 - (centerLng - minLng) * newScale,
      y: mapSize.height / 2 - (centerLat - minLat) * newScale,
    })
  }, [stations, mapSize])

  useEffect(() => {
    if (!mapRef.current) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      const rect = mapRef.current?.getBoundingClientRect()
      if (!rect) return

      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1

      setScale((prevScale) => {
        const newScale = prevScale * zoomFactor

        // 마우스 위치를 기준으로 오프셋 조정
        const newOffsetX = mouseX - (mouseX - offset.x) * zoomFactor
        const newOffsetY = mouseY - (mouseY - offset.y) * zoomFactor

        setOffset({ x: newOffsetX, y: newOffsetY })

        return newScale
      })
    }

    const mapElement = mapRef.current
    mapElement.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      mapElement.removeEventListener("wheel", handleWheel)
    }
  }, [offset])

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    setOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // 충전소 마커 클릭 핸들러
  const handleMarkerClick = (station: StationOverviewData, x: number, y: number) => {
    onSelectStation(station)
    setInfoWindow({ x, y, station })
  }

  // 정보 창에서 상세 보기 클릭 핸들러
  const handleViewDetails = () => {
    if (!selectedStation) return

    // 충전소 데이터를 URL 파라미터로 전달
    const stationData = encodeURIComponent(JSON.stringify(selectedStation))

    // 새 창 열기 - 전체 화면에 가깝게 설정
    const width = Math.min(1400, window.screen.width * 0.9)
    const height = Math.min(900, window.screen.height * 0.9)
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2

    window.open(
      `/station-detail?stationData=${stationData}`,
      "stationDetail",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`,
    )
  }

  // 충전소 상태에 따른 색상 반환
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500"
      case "INACTIVE":
        return "bg-red-500"
      case "MAINTENANCE":
        return "bg-yellow-500"
      default:
        return "bg-black"
    }
  }

  // 위도, 경도를 화면 좌표로 변환
  const getMarkerPosition = (lat: number, lng: number) => {
    if (stations.length === 0) return { x: 0, y: 0 }

    // 위도, 경도 범위 계산
    let minLat = Number.MAX_VALUE
    let minLng = Number.MAX_VALUE

    stations.forEach((station) => {
      minLat = Math.min(minLat, station.latitude)
      minLng = Math.min(minLng, station.longitude)
    })

    // 화면 좌표 계산
    const x = (lng - minLng) * scale + offset.x
    const y = (lat - minLat) * scale + offset.y

    return { x, y }
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-full bg-zinc-800 relative overflow-hidden cursor-grab"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* 격자 배경 */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="border border-zinc-700/30"></div>
        ))}
      </div>

      {/* 충전소 마커 */}
      {stations.map((station) => {
        const { x, y } = getMarkerPosition(station.latitude, station.longitude)
        const isSelected = selectedStation?.stationId === station.stationId

        return (
          <div
            key={station.stationId}
            className={`absolute w-4 h-4 rounded-full ${getStatusColor(station.status)} transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${isSelected ? "ring-2 ring-white scale-150" : ""}`}
            style={{ left: `${x}px`, top: `${y}px` }}
            onClick={() => handleMarkerClick(station, x, y)}
            title={station.stationName}
          ></div>
        )
      })}

      {/* 정보 창 */}
      {infoWindow && (
        <div
          className="absolute bg-zinc-900 p-2 rounded shadow-lg z-10 text-sm min-w-[150px]"
          style={{
            left: `${infoWindow.x}px`,
            top: `${infoWindow.y - 60}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="font-bold">{infoWindow.station.stationName}</div>
          <div
            className={`text-xs ${
              infoWindow.station.status === "ACTIVE"
                ? "text-green-500"
                : infoWindow.station.status === "INACTIVE"
                  ? "text-red-500"
                  : infoWindow.station.status === "MAINTENANCE"
                    ? "text-yellow-500"
                    : ""
            }`}
          >
            {infoWindow.station.status}
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            위도: {infoWindow.station.latitude.toFixed(4)}
            <br />
            경도: {infoWindow.station.longitude.toFixed(4)}
          </div>
          <button
            className="mt-2 w-full bg-zinc-700 hover:bg-zinc-600 text-xs py-1 rounded"
            onClick={handleViewDetails}
          >
            상세 정보 보기
          </button>
        </div>
      )}

      {/* 줌 컨트롤 */}
      <div className="absolute right-4 top-4 flex flex-col bg-zinc-900 rounded overflow-hidden">
        <button className="px-2 py-1 hover:bg-zinc-700 text-lg" onClick={() => setScale((prev) => prev * 1.2)}>
          +
        </button>
        <div className="border-t border-zinc-700"></div>
        <button className="px-2 py-1 hover:bg-zinc-700 text-lg" onClick={() => setScale((prev) => prev * 0.8)}>
          -
        </button>
      </div>

      {/* 상세 정보 모달 */}
      {selectedStation && (
        <StationDetailModal
          station={selectedStation}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  )
}
