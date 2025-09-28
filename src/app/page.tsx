import { useEffect, useState } from "react";
import Map from "../components/Map";

import { decodeGtfs, parseGtfsFile } from "../lib/gtfs";

export default async function Home() {
  const routes = await parseGtfsFile("routes.txt");
  const trips = await parseGtfsFile("trips.txt");

  const vehicles = await decodeGtfs(
    "https://gtfs.ztp.krakow.pl/VehiclePositions_T.pb"
  );

  //console.log(JSON.stringify(vehicles, null, 2));

  const markers: Array<{ position: [number, number]; label: string }> = [];
  for (const entity of vehicles.entity) {
    if (entity.vehicle && entity.vehicle.position) {
      const pos = entity.vehicle.position;

      const trip: any = trips.find(
        (t: any) => t.trip_id == entity.vehicle.trip.tripId
      );

      if (!trip) continue;
      const route: any = routes.find((r: any) => r.route_id == trip.route_id);

      markers.push({
        position: [pos.latitude, pos.longitude],
        label: route.route_short_name,
      });
    }
  }

  return (
    <div>
      <Map markers={markers} />
    </div>
  );
}
