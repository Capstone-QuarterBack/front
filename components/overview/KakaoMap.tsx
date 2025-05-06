"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import type { StationOverviewData } from "@/services/api"

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

  // 카카오맵 스크립트 로드 완료 후 실행될 함수
  const handleKakaoMapLoaded = () => {
    setIsLoaded(true)
  }

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current || stations.length === 0) return

    const initMap = () => {
      try {
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
      } catch (error) {
        console.error("카카오맵 초기화 오류:", error)
      }
    }

    // 카카오맵 API가 로드된 경우에만 지도 초기화
    if (window.kakao && window.kakao.maps) {
      initMap()
    } else {
      console.error("카카오맵 API가 로드되지 않았습니다.")
    }
  }, [isLoaded, stations])

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (!mapInstance || stations.length === 0) return

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
  }, [mapInstance, stations, selectedStation, onSelectStation])

  // 충전소 상태에 따른 마커 이미지 URL 반환
  const getMarkerImageByStatus = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerGreen.png"
      case "INACTIVE":
        return "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerRed.png"
      case "MAINTENANCE":
        return "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerYellow.png"
      default:
        return "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_black.png"
    }
  }

  // 충전소 상태에 따른 텍스트 색상 반환
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "#10B981" // green-500
      case "INACTIVE":
        return "#EF4444" // red-500
      case "MAINTENANCE":
        return "#F59E0B" // amber-500
      default:
        return "#71717A" // zinc-400
    }
  }

  // 충전소 상태에 따른 텍스트 반환
  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "사용가능"
      case "INACTIVE":
        return "사용중"
      case "MAINTENANCE":
        return "수리중"
      default:
        return "사용중지"
    }
  }

  return (
    <>
      <Script
        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=01401f33c63d337526c796d017d4737d&libraries=services,clusterer,drawing"
        strategy="afterInteractive"
        onLoad={handleKakaoMapLoaded}
      />
      <div className="relative w-full h-full bg-zinc-800">
        <div ref={mapRef} className="w-full h-full" />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 bg-opacity-70">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        )}
      </div>
    </>
  )
}
