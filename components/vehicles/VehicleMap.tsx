"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

interface VehicleMapProps {
  location: string;
  latitude?: number;
  longitude?: number;
}

export default function VehicleMap({
  location,
  latitude = 37.50807983353123,
  longitude = 127.06161980074424,
}: VehicleMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.kakao) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}`;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">지도를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Map
        center={{ lat: latitude, lng: longitude }}
        style={{ width: "100%", height: "100%" }}
        level={3}
      >
        <MapMarker position={{ lat: latitude, lng: longitude }}>
          <div style={{ padding: "5px", fontSize: "12px" }}>{location}</div>
        </MapMarker>
      </Map>
    </div>
  );
}
