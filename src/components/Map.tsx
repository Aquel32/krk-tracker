"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const Map = ({
  markers,
}: {
  markers: Array<{ position: [number, number]; label: string }>;
}) => {
  const position: [number, number] = [50.0626, 19.9386];

  return (
    <MapContainer
      center={position}
      zoom={11}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      {markers.map((item, idx) => (
        <Marker
          key={idx}
          position={item.position}
          icon={L.divIcon({
            html: `<p class="w-5 h-5 flex justify-center items-center bg-sky-500 font-mono">${item.label}</p>`,
            className: "",
          })}
        >
          <Popup>{item.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
