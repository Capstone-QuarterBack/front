"use client"

import { useEffect, useRef, useState } from "react"
import type { StationOverviewData } from "@/services/api"
import {
  ensureKakaoMapLoaded,
  getMarkerImageByStatus,
  getStatusColor,
  getStatusText,
} from "@/lib/utils/kakao-map-utils"

declare global {
  interface Window {
    kakao: any
  }
}

interface KakaoMapProps {
  stations: StationOverviewData[]
  onSelectStation: (station: StationOverviewData) => void
  selectedStation: StationOverviewData | null
}

export function KakaoMap({ stations, onSelectStation, selectedStation }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 카카오맵 API 로드 및 초기화
  useEffect(() => {
    if (!mapRef.current) return

    const initializeMap = async () => {
      try {
        // 카카오맵 API 로드 확인
        await ensureKakaoMapLoaded()

        // 카카오맵 API가 로드되었으면 지도 초기화
        if (window.kakao && window.kakao.maps) {
          // 지도 생성
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
            level: 7, // 확대 레벨
          }

          const map = new window.kakao.maps.Map(mapRef.current, options)
          setMapInstance(map)

          // 지도 컨트롤 추가
          const zoomControl = new window.kakao.maps.ZoomControl()
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)

          // 지도 타입 컨트롤 추가
          const mapTypeControl = new window.kakao.maps.MapTypeControl()
          map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)

          setIsLoaded(true)
          console.log("카카오맵 초기화 완료")
        }
      } catch (error) {
        console.error("카카오맵 초기화 오류:", error)
      }
    }

    initializeMap()
  }, [])

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (!mapInstance || stations.length === 0) return

    console.log("마커 생성 시작")

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null))

    // 새 마커 생성
    const newMarkers = stations.map((station) => {
      // 충전소 상태에 따른 마커 이미지 설정
      const markerImageSrc = getMarkerImageByStatus(station.status)
      const imageSize = new window.kakao.maps.Size(24, 24)
      const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize)

      // 마커 생성
      const position = new window.kakao.maps.LatLng(station.latitude, station.longitude)
      const marker = new window.kakao.maps.Marker({
        position,
        map: mapInstance,
        title: station.stationName,
        image: markerImage,
      })

      // 인포윈도우 생성
      const infoContent = `
        <div class="p-2 bg-zinc-900 rounded shadow-lg text-white text-xs" style="min-width: 150px; color: white; background-color: #18181B; padding: 8px; border-radius: 4px;">
          <div style="font-weight: bold; margin-bottom: 4px;">${station.stationName}</div>
          <div style="color: ${getStatusColor(station.status)};">${getStatusText(station.status)}</div>
        </div>
      `
      const infoWindow = new window.kakao.maps.InfoWindow({
        content: infoContent,
        removable: true,
      })

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, "click", () => {
        // 다른 인포윈도우 닫기
        markers.forEach((m) => {
          if (m.infoWindow) {
            m.infoWindow.close()
          }
        })

        // 선택한 충전소 정보 업데이트
        onSelectStation(station)

        // 인포윈도우 표시
        infoWindow.open(mapInstance, marker)
      })

      // 마커에 인포윈도우 참조 저장
      marker.infoWindow = infoWindow

      return marker
    })

    setMarkers(newMarkers)

    // 모든 마커가 보이도록 지도 범위 조정
    if (newMarkers.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds()
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition())
      })
      mapInstance.setBounds(bounds)
    }

    // 선택된 충전소가 있으면 해당 마커 강조
    if (selectedStation) {
      const selectedMarker = newMarkers.find((marker) => marker.getTitle() === selectedStation.stationName)
      if (selectedMarker) {
        // 선택된 마커 위치로 지도 중심 이동
        mapInstance.setCenter(selectedMarker.getPosition())

        // 인포윈도우 표시
        selectedMarker.infoWindow.open(mapInstance, selectedMarker)
      }
    }

    console.log("마커 생성 완료")
  }, [mapInstance, stations, selectedStation, onSelectStation])

  return (
    <div className="relative w-full h-full bg-zinc-800">
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 bg-opacity-70">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <div className="ml-3 text-white">카카오맵 로딩 중...</div>
        </div>
      )}
    </div>
  )
}
