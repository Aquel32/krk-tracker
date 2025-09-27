"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const Map = () => {
  const position: [number, number] = [50.0626, 19.9386];

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      <Marker
        position={position}
        icon={L.divIcon({ className: "w-5 h-5 bg-sky-500/100" })}
      >
        <Popup>KRAKÓW</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
