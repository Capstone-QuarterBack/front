"use client";

import { useEffect, useRef, useState } from "react";
import type { StationOverviewData } from "@/services/api";
import { getStatusColor, getStatusText } from "@/lib/utils/kakao-map-utils";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  stations: StationOverviewData[];
  onSelectStation: (station: StationOverviewData) => void;
  selectedStation: StationOverviewData | null;
}

export function KakaoMap({
  stations,
  onSelectStation,
  selectedStation,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    function checkKakaoMapsLoaded() {
      if (typeof window !== "undefined" && window.kakao && window.kakao.maps) {
        setIsApiLoaded(true);
        return true;
      }
      return false;
    }

    if (checkKakaoMapsLoaded()) return;

    const handleKakaoMapsLoaded = () => {
      if (checkKakaoMapsLoaded()) return;
    };

    window.addEventListener("kakao_maps_loaded", handleKakaoMapsLoaded);

    const intervalId = setInterval(() => {
      if (checkKakaoMapsLoaded()) {
        clearInterval(intervalId);
      }
    }, 500);

    if (
      typeof window !== "undefined" &&
      !document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]')
    ) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
      script.async = true;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            setIsApiLoaded(true);
            window.dispatchEvent(new Event("kakao_maps_loaded"));
          });
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      window.removeEventListener("kakao_maps_loaded", handleKakaoMapsLoaded);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isApiLoaded || mapInstance) return;

    const validStations = stations.filter(
      (s) =>
        s.latitude >= 33 &&
        s.latitude <= 38.5 &&
        s.longitude >= 124 &&
        s.longitude <= 132
    );

    const initialCenter =
      validStations.length > 0
        ? new window.kakao.maps.LatLng(
            validStations[0].latitude,
            validStations[0].longitude
          )
        : new window.kakao.maps.LatLng(37.5665, 126.978);

    const options = {
      center: initialCenter,
      level: 7,
    };

    try {
      const map = new window.kakao.maps.Map(mapRef.current, options);
      setMapInstance(map);

      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(
        mapTypeControl,
        window.kakao.maps.ControlPosition.TOPRIGHT
      );

      setIsLoaded(true);
    } catch (error) {
      console.error("지도 초기화 오류:", error);
    }
  }, [isApiLoaded, mapInstance, stations]);

  useEffect(() => {
    if (!mapInstance || !isLoaded || stations.length === 0) return;

    // 기존 마커 제거
    markers.forEach((marker) => {
      marker.setMap(null);
    });

    const validStations = stations.filter((station) => {
      const isValidLat = station.latitude >= 33 && station.latitude <= 40.5;
      const isValidLng = station.longitude >= 124 && station.longitude <= 132;
      return isValidLat && isValidLng;
    });

    const newMarkers = validStations
      .map((station) => {
        try {
          const position = new window.kakao.maps.LatLng(
            station.latitude,
            station.longitude
          );
          const color = getStatusColor(station.status);

          // 마커 이미지 생성
          const markerImage = new window.kakao.maps.MarkerImage(
            `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
              `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" strokeWidth="2"/>
            </svg>`
            )}`,
            new window.kakao.maps.Size(24, 24),
            { offset: new window.kakao.maps.Point(12, 12) }
          );

          // 마커 생성
          const marker = new window.kakao.maps.Marker({
            position: position,
            image: markerImage,
            map: mapInstance,
            clickable: true,
          });

          // 정보창 내용
          const iwContent = document.createElement("div");
          iwContent.className = "info-window";
          iwContent.style.cssText =
            "padding:10px;background:#27272A;color:white;border-radius:5px;min-width:150px;box-shadow:0 2px 6px rgba(0,0,0,0.3);";

          const titleDiv = document.createElement("div");
          titleDiv.style.cssText = "font-weight:bold;margin-bottom:5px;";
          titleDiv.textContent = station.stationName;
          iwContent.appendChild(titleDiv);

          const idDiv = document.createElement("div");
          idDiv.style.cssText = "font-size:12px;margin-bottom:5px;";
          idDiv.textContent = `ID: ${station.stationId}`;
          iwContent.appendChild(idDiv);

          const statusDiv = document.createElement("div");
          statusDiv.style.cssText = `font-size:12px;color:${color};margin-bottom:8px;`;
          statusDiv.textContent = getStatusText(station.status);
          iwContent.appendChild(statusDiv);

          const buttonDiv = document.createElement("div");
          buttonDiv.style.cssText = "text-align:center;";

          const detailButton = document.createElement("button");
          detailButton.id = `detail-btn-${station.stationId}`;
          detailButton.textContent = "상세 정보 보기";
          detailButton.style.cssText =
            "background:#3F3F46;border:none;color:white;padding:4px 8px;border-radius:4px;font-size:11px;cursor:pointer;";

          // 버튼 클릭 이벤트 - 등록충전소 정보와 동일한 동작 구현
          detailButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 충전소 데이터를 URL 파라미터로 전달
            const stationOverviewData = {
              stationId: station.stationId,
              stationName: station.stationName,
              latitude: station.latitude,
              longitude: station.longitude,
              status: station.status,
            };

            // 충전소 데이터를 URL 파라미터로 전달
            const stationData = encodeURIComponent(
              JSON.stringify(stationOverviewData)
            );

            // 새 창에서 충전소 상세 정보 페이지 열기
            const width = Math.min(1400, window.screen.width * 0.9);
            const height = Math.min(900, window.screen.height * 0.9);
            const left = (window.screen.width - width) / 2;
            const top = (window.screen.height - height) / 2;

            window.open(
              `/station-detail?stationData=${stationData}`,
              "stationDetail",
              `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
            );
          };

          buttonDiv.appendChild(detailButton);
          iwContent.appendChild(buttonDiv);

          // 정보창 생성
          const infoWindow = new window.kakao.maps.InfoWindow({
            content: iwContent,
            removable: true,
          });

          // 마커 클릭 이벤트
          window.kakao.maps.event.addListener(marker, "click", () => {
            // 다른 정보창 닫기
            markers.forEach((m) => {
              if (m.infoWindow) {
                m.infoWindow.close();
              }
            });

            // 정보창 열기
            infoWindow.open(mapInstance, marker);

            // 선택된 충전소 업데이트
            onSelectStation(station);
          });

          // 마커에 정보창 참조 저장
          marker.infoWindow = infoWindow;
          marker.station = station;

          return marker;
        } catch (err) {
          console.error("마커 생성 오류:", err);
          return null;
        }
      })
      .filter(Boolean);

    setMarkers(newMarkers);

    if (newMarkers.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      validStations.forEach((s) =>
        bounds.extend(new window.kakao.maps.LatLng(s.latitude, s.longitude))
      );
      mapInstance.setBounds(bounds);
    }
  }, [mapInstance, stations, isLoaded, onSelectStation]);

  useEffect(() => {
    if (!mapInstance || !isLoaded || !selectedStation || markers.length === 0)
      return;

    const position = new window.kakao.maps.LatLng(
      selectedStation.latitude,
      selectedStation.longitude
    );
    mapInstance.setCenter(position);
    mapInstance.setLevel(3);

    const marker = markers.find(
      (m) => m.station?.stationId === selectedStation.stationId
    );

    if (marker) {
      // 다른 정보창 닫기
      markers.forEach((m) => {
        if (m.infoWindow) {
          m.infoWindow.close();
        }
      });

      // 선택된 마커의 정보창 열기
      if (marker.infoWindow) {
        marker.infoWindow.open(mapInstance, marker);
      }
    }
  }, [mapInstance, isLoaded, selectedStation, markers]);

  return (
    <div className="relative w-full h-full bg-zinc-800">
      <div ref={mapRef} className="w-full h-full" />
      {(!isApiLoaded || !isLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 bg-opacity-70">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <div className="ml-3 text-white">카카오맵 로딩 중...</div>
        </div>
      )}
      {isLoadingDetail && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 bg-opacity-50 z-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <div className="ml-3 text-white">충전소 상세 정보 로딩 중...</div>
        </div>
      )}
      {isLoaded && markers.length === 0 && stations.length > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md">
          표시할 수 있는 유효한 좌표가 없습니다. 콘솔을 확인하세요.
        </div>
      )}
    </div>
  );
}
