"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MarkerData } from "../lib/types";

const Map = ({ markers }: { markers: MarkerData[] }) => {
  const position: [number, number] = [50.0626, 19.9386];

  return (
    <MapContainer
      center={position}
      zoom={11}
      style={{ height: "100vh", width: "100vw", zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      {markers.map((item, idx) => {
        return (
          <Marker
            key={idx}
            position={item.position}
            icon={L.divIcon({
              html: `<div class="${item.style}">${item.label}</div>`,
              className: "",
            })}
            eventHandlers={{
              click: item.onClick,
            }}
          />
        );
      })}
    </MapContainer>
  );
};

export default Map;
