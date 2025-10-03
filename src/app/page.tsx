"use client";

import { useEffect, useState } from "react";
const Map = dynamic(() => import("../components/Map"), { ssr: false });
import { MarkerData } from "@/lib/types";
import Entity from "@/components/Entity";
import Line from "@/components/Line";
import Stop from "@/components/Stop";
import dynamic from "next/dynamic";
import { Query } from "@/lib/db";
import { decodeGtfs } from "@/lib/gtfs";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<{
    entity: any;
    data: any;
  } | null>(null);
  const [selectedStop, setSelectedStop] = useState<{
    stop: any;
  } | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [stopsMarkers, setStopsMarkers] = useState<MarkerData[]>([]);

  // function updateSelectedMarker() {
  //   if (selectedEntity) {
  //     console.log("Selected entity:", selectedEntity);
  //     setMarkers([
  //       ...markers,
  //       {
  //         position: [
  //           selectedEntity.entity.vehicle.position.latitude,
  //           selectedEntity.entity.vehicle.position.longitude,
  //         ],
  //         style: `w-5 h-5 flex justify-center items-center bg-sky-500 font-mono text-yellow-300 border border-yellow-500 border-2`,
  //         label: selectedEntity.data.route_short_name,
  //         onClick: () => setSelectedEntity(selectedEntity),
  //       },
  //     ]);
  //   }
  // }

  useEffect(() => {
    async function loadInitialData() {
      const stops = await Query("SELECT * FROM stops");
      const mrks: MarkerData[] = [];
      stops.map((s: any) => {
        mrks.push({
          position: [s.stop_lat, s.stop_lon],
          style: "font-mono text-black",
          label: "■",
          onClick: () => {
            setSelectedStop({ stop: s });
            setSelectedEntity(null);
          },
        });
      });
      setStopsMarkers(mrks);
    }

    async function fetchData() {
      const vehicles = await decodeGtfs(
        "https://gtfs.ztp.krakow.pl/VehiclePositions_T.pb"
      );

      const mrks: MarkerData[] = [];

      for (const entity of vehicles.entity) {
        if (entity.vehicle && entity.vehicle.position) {
          const pos = entity.vehicle.position;

          const data: any = (
            await Query(
              `SELECT t.*, r.* FROM trips t INNER JOIN routes r ON t.route_id = r.route_id WHERE t.trip_id = '${entity.vehicle.trip.tripId}'`
            )
          )[0];

          mrks.push({
            position: [pos.latitude, pos.longitude],
            style: `w-5 h-5 flex justify-center items-center bg-sky-500 font-mono ${
              selectedEntity && selectedEntity.entity === entity
                ? "text-yellow-300 border border-yellow-500 border-2"
                : "text-white"
            }`,
            label: data.route_short_name,
            onClick: () => {
              setSelectedEntity({ entity, data });
              setSelectedStop(null);
            },
          });

          if (selectedEntity && selectedEntity.entity === entity) {
            setSelectedEntity({ entity, data });
            setSelectedStop(null);
          }
        }
      }

      setData(vehicles.entity);
      setMarkers(mrks);
      setTimeout(fetchData, 20000);
      console.log("Data refreshed");
    }

    loadInitialData();
    fetchData();
  }, []);

  return (
    <div>
      <Map markers={[...markers, ...stopsMarkers]} />

      <div className="absolute top-2 left-2 bg-white p-2 border border-gray-300 z-10 text-black flex flex-col gap-2">
        {selectedEntity && <Entity selectedEntity={selectedEntity} />}
        {/* {selectedEntity && <Line selectedEntity={selectedEntity} data={data} /> */}
        {selectedStop && <Stop selectedStop={selectedStop} data={data} />}
      </div>
    </div>
  );
}
