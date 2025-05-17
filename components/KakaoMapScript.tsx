"use client";

import { useEffect } from "react";

export function KakaoMapScript() {
  useEffect(() => {
    // 이미 로드된 경우 중복 로드 방지
    if (window.kakao && window.kakao.maps) {
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          console.log("✅ Kakao Maps API 로드 완료");
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      // 스크립트 제거 (필요한 경우)
      // document.head.removeChild(script)
    };
  }, []);

  return null;
}
