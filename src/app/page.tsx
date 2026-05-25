"use client";

import { useEffect, useState } from "react";
import { EntityType, MarkerData } from "@/lib/types";
import Entity from "@/components/Entity";
import Stop from "@/components/Stop";
import dynamic from "next/dynamic";
const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });
import { Query } from "@/lib/db";
import { getRealtimeData, getStaticData } from "@/lib/gtfs";
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<{
    entity: GtfsRealtimeBindings.transit_realtime.FeedEntity;
    data: any;
  } | null>(null);
  const [selectedStop, setSelectedStop] = useState<{
    stop: any;
  } | null>(null);
  const [vehicleMarkers, setVehicleMarkers] = useState<MarkerData[]>([]);
  const [stopMarkers, setStopMarkers] = useState<MarkerData[]>([]);
  const [shapes, setShapes] = useState<[number, number][]>([]);

  // function updateSelectedMarker(newSelectedEntity: any) {
  //   if (!newSelectedEntity) return;

  //   console.log("Updating selected marker", newSelectedEntity);

  //   setVehicleMarkers([
  //     ...vehicleMarkers,
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
      // await getStaticData();

      const stops = await Query(
        "SELECT stop_id, stop_name, stop_desc, stop_lat, stop_lon FROM stops",
      );
      const mrks: MarkerData[] = [];
      stops.map((s: any) => {
        mrks.push({
          position: [s.stop_lat, s.stop_lon],
          style: "font-mono text-black",
          label: "■",
          type: EntityType.STOP,
          onClick: () => {
            setSelectedStop({ stop: s });
            setSelectedEntity(null);
          },
        });
      });
      setStopMarkers(mrks);
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
      for (const entity of entities as any) {
        if (!entity.vehicle) continue;
        const entityData = dataMap.get(entity.vehicle!.trip!.tripId!);
        const backgroundColor =
          (entityData?.route_type ?? "0") === "3"
            ? "bg-indigo-950"
            : "bg-indigo-800";
        newMarkers.push({
          position: [
            entity.vehicle.position.latitude,
            entity.vehicle.position.longitude,
          ],
          style: `w-5 h-5 flex justify-center items-center ${backgroundColor} font-mono ${
            selectedEntity && selectedEntity.entity.id === entity.id
              ? "text-yellow-300 border border-yellow-500 border-2"
              : "text-white"
          }`,
          label: entityData ? entityData.route_short_name : "?",
          type: EntityType.VEHICLE,
          onClick: async () => {
            console.log("Marker clicked", entity, entityData);
            setSelectedEntity({ entity: entity, data: entityData });
            setSelectedStop(null);
          },
        });
        index++;
      }
      setData(entities);
      setVehicleMarkers(newMarkers);
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
      <MapComponent
        vehicleMarkers={vehicleMarkers}
        stopMarkers={stopMarkers}
        shapes={shapes}
      />

      <div className="absolute top-2 left-2">
        {selectedEntity && (
          <Entity selectedEntity={selectedEntity} setShapes={setShapes} />
        )}
        {selectedStop && <Stop selectedStop={selectedStop} data={data} />}
      </div>
    </div>
  );
}
