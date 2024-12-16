"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

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
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">지도를 불러올는 중...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      zoom={17}
      center={{ lat: latitude, lng: longitude }}
      mapContainerClassName="w-full h-full"
    >
      <Marker position={{ lat: latitude, lng: longitude }} title={location} />
    </GoogleMap>
  );
}
