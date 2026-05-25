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
        `SELECT DISTINCT stop_times.departure_time, routes.route_short_name, trips.trip_headsign FROM stop_times INNER JOIN trips ON stop_times.trip_id = trips.trip_id INNER JOIN routes ON trips.route_id = routes.route_id WHERE stop_id = '${selectedStop.stop.stop_id}' AND departure_time > '${time}' ORDER BY departure_time LIMIT 10`,
      );

      // const stops: any[] = await Query(
      //   `SELECT st.departure_time, r.route_short_name, t.trip_headsign FROM stop_times AS st JOIN trips AS t ON t.trip_id = st.trip_id JOIN routes AS r ON r.route_id = t.route_id WHERE st.stop_id = ${selectedStop.stop.stop_id} AND st.departure_time > ${time} ORDER BY st.departure_time LIMIT 10;`,
      // );

      console.log(stops);
      setNextDepartures(stops);
    }

    fetchNextStops();
  }, [selectedStop]);

  return (
    <>
      <div className="bg-gray-950 p-4 border border-gray-500 z-10 text-white flex flex-col gap-2">
        <div className="flex items-center gap-3 border-b-2 border-gray-500">
          <h1 className="text-3xl font-bold">{selectedStop.stop.stop_name}</h1>
          <h1 className="text-lg">{selectedStop.stop.stop_desc}</h1>
        </div>

        <div>
          <p className="text-sm text-gray-300">Najbliższe odjazdy:</p>
          <div className="overflow-auto h-64 px-2">
            {nextDepartures.map((departure, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex gap-1 items-center">
                  <h2 className="text-xl font-bold">
                    {departure.route_short_name}
                  </h2>
                  <h2>{departure.trip_headsign}</h2>
                </div>
                <p className="ml-5">{departure.departure_time.slice(0, 5)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
