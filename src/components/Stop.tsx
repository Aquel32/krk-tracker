import { Query } from "@/lib/db";
import { useEffect, useState } from "react";

export default function Stop({
  selectedStop,
  data,
}: {
  selectedStop: { stop: any };
  data: any;
}) {
  const [nextDepartures, setNextDepartures] = useState<any[]>([]);
  useEffect(() => {
    async function fetchNextStops() {
      const time = new Date().toTimeString().split(" ")[0];

      const stops: any[] = await Query(
        `SELECT DISTINCT stop_times.departure_time, routes.route_short_name, trips.trip_headsign FROM stop_times INNER JOIN trips ON stop_times.trip_id = trips.trip_id INNER JOIN routes ON trips.route_id = routes.route_id WHERE stop_id = '${selectedStop.stop.stop_id}' AND departure_time > '${time}' ORDER BY departure_time LIMIT 10`
      );
      setNextDepartures(stops);
    }

    fetchNextStops();
  }, [selectedStop]);

  return (
    <>
      <div>
        <h1>Przystanek: {selectedStop.stop.stop_name}</h1>
        <p>Najbliższe odjazdy:</p>
        <div>
          {nextDepartures.map((departure, index) => (
            <div
              key={index}
              className="border border-gray-300 mb-1 flex gap-2 p-1"
            >
              <p>
                {departure.route_short_name} - {departure.trip_headsign} -{" "}
                {departure.departure_time.slice(0, 5)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
