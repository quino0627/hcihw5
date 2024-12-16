"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Map, MapMarker } from "react-kakao-maps-sdk";

interface VehicleMapProps {
  location: string;
  latitude?: number;
  longitude?: number;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export default function VehicleMap({
  location,
  latitude = 37.50807983353123,
  longitude = 127.06161980074424,
}: VehicleMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const kakaoMapKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

  useEffect(() => {
    if (window.kakao && !mapLoaded) {
      window.kakao.maps.load(() => {
        setMapLoaded(true);
      });
    }
  }, [mapLoaded]);

  if (!kakaoMapKey) {
    console.error("Kakao Maps API key is not defined");
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">지도를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <>
      <Script
        strategy="beforeInteractive"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`}
        onLoad={() => {
          window.kakao.maps.load(() => {
            setMapLoaded(true);
          });
        }}
      />
      <div className="w-full h-full">
        {mapLoaded ? (
          <Map
            center={{ lat: latitude, lng: longitude }}
            style={{ width: "100%", height: "100%" }}
            level={3}
          >
            <MapMarker position={{ lat: latitude, lng: longitude }}>
              <div style={{ padding: "5px", fontSize: "12px" }}>{location}</div>
            </MapMarker>
          </Map>
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">지도를 불러오는 중...</p>
          </div>
        )}
      </div>
    </>
  );
}
