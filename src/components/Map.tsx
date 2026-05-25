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
import { useState } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";

const Map = ({
  vehicleMarkers,
  stopMarkers,
  shapes,
}: {
  vehicleMarkers: MarkerData[];
  stopMarkers: MarkerData[];
  shapes: [number, number][];
}) => {
  const position: [number, number] = [50.0626, 19.9386];
  const [display, setDisplay] = useState(false);

  function MapUpdater() {
    const map = useMap();

    map.on("zoomend", (e) => {
      const zoomLevel = map.getZoom();
      setDisplay(zoomLevel >= 16 ? true : false);
    });

    return null;
  }

  const createClusterCustomIcon = function (cluster: any) {
    console.log(cluster);
    return L.circle([0, 0], {
      radius: 20,
      color: "oklch(62.3% 0.214 259.815)",
    });
    return L.divIcon({
      html: `<span>$ABC</span>`,
      className: "custom-marker-cluster",
      iconSize: L.point(33, 33, true),
    });
  };

  function clickCluster(cluster: any) {
    console.log(cluster);
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
      <MapUpdater />
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
                click: item.onClick,
              }}
            />
          );
        })}
      <Polyline
        pathOptions={{ color: "oklch(62.3% 0.214 259.815)" }}
        positions={shapes}
      />
    </MapContainer>
  );
};

export default Map;
