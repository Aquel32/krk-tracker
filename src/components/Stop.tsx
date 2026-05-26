import { Query } from "@/lib/db";
import { timeDiff, timeToNumber } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Stop({
  selectedStops,
  data,
  dataMap,
}: {
  selectedStops: any[];
  data: any;
  dataMap: Map<string, any>;
}) {
  const [nextDepartures, setNextDepartures] = useState<any[]>([]);
  useEffect(() => {
    async function fetchNextStops() {
      const time = new Date().toTimeString().split(" ")[0];
      const selectedStopsIds = selectedStops
        .map((s) => `'${s.stop_id}'`)
        .join(",");

      const stops: any[] = await Query(
        `SELECT stop_times.departure_time, routes.route_short_name, trips.trip_headsign, trips.trip_id FROM stop_times INNER JOIN trips ON stop_times.trip_id = trips.trip_id INNER JOIN routes ON trips.route_id = routes.route_id INNER JOIN calendar_dates ON trips.service_id = calendar_dates.service_id WHERE calendar_dates.date = CURRENT_DATE AND stop_id IN (${selectedStopsIds}) ORDER BY departure_time`,
      );

      // AND departure_time > '${time}' ORDER BY departure_time LIMIT 10

      let firstFound = -1;
      let lastFound = -1;
      const final = await Promise.all(
        stops.map(async (s, i) => {
          const entityData = data.get(s.trip_id);
          const dbData = dataMap.get(s.trip_id);

          let found = false;
          let delay = "";

          if (entityData && dbData) {
            found = true;
            if (firstFound === -1) firstFound = i;
            lastFound = i;

            // const sequenceOfMainStop = (
            //   await Query(
            //     `SELECT stop_sequence FROM stop_times WHERE trip_id = '${s.trip_id}' AND stop_id IN (${selectedStopsIds}) LIMIT 1`,
            //   )
            // )[0].stop_sequence;

            const stop = (
              await Query(
                `SELECT stops.stop_name, stop_times.arrival_time, stop_times.departure_time, stop_times.stop_sequence, stop_desc FROM stops INNER JOIN stop_times ON stops.stop_id = stop_times.stop_id WHERE stop_times.trip_id = '${s.trip_id}' AND stop_times.stop_id = '${entityData.vehicle!.stopId!}' LIMIT 1`,
              )
            )[0];
            // stop - przystanek na ktorym aktualnie jest ten pojazd
            const diff = timeDiff(time, stop.departure_time);
            if (diff == "00:00") {
              delay = "";
            } else if (diff.startsWith("00:0")) {
              delay = diff.slice(-1);
            } else {
              delay = diff.slice(-2);
            }

            // if (
            //   parseFloat(stop.stop_sequence) > parseFloat(sequenceOfMainStop)
            // ) {
            //   delay += " P";
            // }
          } else {
            delay = "N/A";
          }

          return {
            stop: s,
            entityData,
            dbData,
            delay,
            found,
            arrivalTime: timeToNumber(s.departure_time),
            realTime: timeToNumber(s.departure_time) + (parseInt(delay) || 0),
          };
        }),
      );

      const filteredFinal = final
        .filter((s, i) => {
          if (i < firstFound || i > lastFound) {
            return false;
          }

          if (s.realTime < timeToNumber(time)) {
            return false;
          }

          return true;
        })
        .sort((a, b) => a.realTime - b.realTime);

      setNextDepartures(filteredFinal);
    }

    fetchNextStops();
  }, [selectedStops]);

  return (
    <>
      <div className="bg-gray-950 p-4 border border-gray-500 z-10 text-white flex flex-col gap-2">
        <div className="flex items-center gap-3 border-b-2 border-gray-500">
          <h1 className="text-3xl font-bold">{selectedStops[0]?.stop_name}</h1>
          <h1 className="text-lg">{selectedStops[0]?.stop_desc}</h1>
        </div>

        <div>
          <p className="text-sm text-gray-300">Najbliższe odjazdy:</p>
          <div className="overflow-auto h-64 px-2">
            {nextDepartures.map((departure, index) => {
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex gap-1 items-center">
                    <h2 className="text-xl font-bold">
                      {departure.stop.route_short_name}
                    </h2>
                    <h2>{departure.stop.trip_headsign}</h2>
                  </div>
                  <p className="ml-3 flex justify-start gap-1">
                    {departure.stop.departure_time.slice(0, 5)}
                    {departure.delay === "N/A" && (
                      <span className="text-gray-400 w-8">N/A</span>
                    )}
                    {departure.delay !== "N/A" && departure.delay !== "" && (
                      <span className="text-red-400 w-8">
                        + {departure.delay}
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
