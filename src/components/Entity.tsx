import { Query } from "@/lib/db";
import { useEffect, useState } from "react";

export default function Entity({
  selectedEntity,
}: {
  selectedEntity: { entity: any; data: any };
}) {
  const [nextStops, setNextStops] = useState<any[]>([]);
  useEffect(() => {
    async function fetchNextStops() {
      const time = new Date().toTimeString().split(" ")[0];

      const stops: any[] = await Query(
        `SELECT stop_times.*, stops.* FROM stop_times INNER JOIN stops ON stop_times.stop_id = stops.stop_id WHERE trip_id = '${selectedEntity.entity.vehicle.trip.tripId}' AND departure_time > '${time}' ORDER BY departure_time`
      );
      console.log(stops);
      setNextStops(stops);
    }

    fetchNextStops();
  }, []);

  return (
    <>
      <div>
        <h1>Linia: {selectedEntity.data.route_short_name}</h1>
        <h1>Kierunek: {selectedEntity.data.trip_headsign}</h1>
        <p>Najbliższe przystanki:</p>
        <div>
          {nextStops.map((stop, index) => (
            <div
              key={index}
              className="border border-gray-300 mb-1 flex gap-2 p-1"
            >
              <p>{stop.stop_name}</p>
              <p>- {stop.departure_time}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
