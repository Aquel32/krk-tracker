"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
  CircleMarker,
} from "react-leaflet";
import L from "leaflet";
import { MarkerData } from "../lib/types";
import { Dispatch, SetStateAction, useState } from "react";
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings";

const Map = ({
  vehicleMarkers,
  stopMarkers,
  shapes,
  onMapClick,
}: {
  vehicleMarkers: MarkerData[];
  stopMarkers: MarkerData[];
  shapes: [number, number][];
  onMapClick: () => void;
}) => {
  const position: [number, number] = [50.0626, 19.9386];
  const [display, setDisplay] = useState(false);

  function MapEventHandler() {
    const map = useMap();

    map.on("zoomend", (e) => {
      const zoomLevel = map.getZoom();
      setDisplay(zoomLevel >= 16 ? true : false);
    });

    map.on("click", (e) => onMapClick());

    return null;
  }

  return (
    <MapContainer
      center={position}
      zoom={11}
      style={{
        height: "100vh",
        width: "100vw",
        zIndex: 0,
        backgroundColor: "var(--color-gray-900)",
      }}
      preferCanvas={true}
      zoomControl={false}
    >
      <TileLayer
        url="https://api.maptiler.com/maps/backdrop-v4-dark/{z}/{x}/{y}.png?key=ESu7n4cP58GHIOPsrndc"
        attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
      />
      {vehicleMarkers.map((item, idx) => {
        return (
          <Marker
            key={idx}
            position={item.position}
            icon={L.divIcon({
              html: `<div class="${item.style}">${item.label}<div class="bearing"></div></div>`,
              className: "",
            })}
            eventHandlers={{
              click: item.onClick,
            }}
          />
        );
      })}
      {display &&
        stopMarkers.map((item, idx) => {
          return (
            <CircleMarker
              key={idx}
              center={item.position}
              radius={5}
              eventHandlers={{
                click: () => setTimeout(item.onClick, 0.1), // FIX
              }}
            />
          );
        })}
      <Polyline
        pathOptions={{ color: "oklch(62.3% 0.214 259.815)" }}
        positions={shapes}
      />
      <MapEventHandler />
    </MapContainer>
  );
};

export default Map;
