"use client";

import { useEffect, useState } from "react";
import { MarkerData } from "@/lib/types";
import Entity from "@/components/Entity";
import Line from "@/components/Line";
import Stop from "@/components/Stop";
import dynamic from "next/dynamic";
const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });
import { Query } from "@/lib/db";
import { getRealtimeData, getStaticData } from "@/lib/gtfs";
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings";

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

  // function updateSelectedMarker(newSelectedEntity: any) {
  //   if (!newSelectedEntity) return;

  //   console.log("Updating selected marker", newSelectedEntity);

  //   setMarkers([
  //     ...markers,
  //     {
  //       position: [
  //         newSelectedEntity.entity.vehicle.position.latitude,
  //         newSelectedEntity.entity.vehicle.position.longitude,
  //       ],
  //       style: `w-5 h-5 flex justify-center items-center bg-sky-500 font-mono text-yellow-300 border border-yellow-500 border-2`,
  //       label: newSelectedEntity.data.route_short_name,
  //       onClick: () => setSelectedEntity(newSelectedEntity),
  //     },
  //   ]);
  // }

  useEffect(() => {
    async function loadInitialData() {
      await getStaticData();

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
      console.time("fetchData");
      const entities: GtfsRealtimeBindings.transit_realtime.FeedEntity[] =
        JSON.parse(await getRealtimeData());

      const trip_ids = entities
        .filter((e) => e.vehicle && e.vehicle.trip && e.vehicle.trip.tripId)
        .map((e) => `'${e.vehicle!.trip!.tripId!}'`);
      const queryResult: any = await Query(
        `SELECT t.*, r.* FROM trips t INNER JOIN routes r ON t.route_id = r.route_id WHERE t.trip_id IN (${trip_ids.join(",")})`,
      );
      const dataMap = new Map<string, any>(
        queryResult.map((row: any) => [row.trip_id, row]),
      );

      const newMarkers: MarkerData[] = [];
      let index = 0;
      for (const entity of entities) {
        if (!entity.vehicle || !entity.vehicle.position) continue;
        const entityData = dataMap.get(entity.vehicle!.trip!.tripId!);
        newMarkers.push({
          position: [
            entity.vehicle.position.latitude,
            entity.vehicle.position.longitude,
          ],
          style: `w-5 h-5 flex justify-center items-center bg-sky-500 font-mono ${
            selectedEntity && selectedEntity.entity.id === entity.id
              ? "text-yellow-300 border border-yellow-500 border-2"
              : "text-white"
          }`,
          label: entityData ? entityData.route_short_name : "?",
          onClick: async () => {
            console.log("Marker clicked", entity);
            // setSelectedEntity({ entity: entity, data: entityData });
            // setSelectedStop(null);
          },
        });
        index++;
      }
      setData(entities);
      setMarkers(newMarkers);
      setTimeout(fetchData, 5000);
      console.log("Data refreshed");
      console.timeEnd("fetchData");
    }

    loadInitialData();
    fetchData();
  }, []);

  //useEffect(() => updateSelectedMarker(selectedEntity), [selectedEntity]);

  return (
    <div>
      <MapComponent markers={[...markers, ...stopsMarkers]} />

      <div className="absolute top-2 left-2 bg-white p-2 border border-gray-300 z-10 text-black flex flex-col gap-2">
        {selectedEntity && <Entity selectedEntity={selectedEntity} />}
        {/* {selectedEntity && <Line selectedEntity={selectedEntity} data={data} /> */}
        {/* {selectedStop && <Stop selectedStop={selectedStop} data={data} />} */}
      </div>
    </div>
  );
}
