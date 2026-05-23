import { Query } from "@/lib/db";
import { useEffect, useState } from "react";
import * as GtfsRealtimeBindings from "gtfs-realtime-bindings";

function timeDiff(startTime: string, endTime: string) {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  let diff = Math.ceil(
    Math.abs(toMinutes(endTime.slice(0, 5)) - toMinutes(startTime.slice(0, 5))),
  );

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export default function Entity({
  selectedEntity,
}: {
  selectedEntity: {
    entity: GtfsRealtimeBindings.transit_realtime.FeedEntity;
    data: any;
  };
}) {
  const [nextStops, setNextStops] = useState<any[]>([]);
  const [currentStop, setCurrentStop] = useState<any>(null);
  const [delay, setDelay] = useState("");
  useEffect(() => {
    async function fetchNextStops() {
      console.time("fetchNextStops");
      const time = new Date().toTimeString().split(" ")[0];
      const stop = (
        await Query(
          `SELECT stops.stop_name, stop_times.arrival_time, stop_times.departure_time FROM stops INNER JOIN stop_times ON stops.stop_id = stop_times.stop_id WHERE stop_times.trip_id = '${selectedEntity.entity.vehicle!.trip!.tripId!}' AND stop_times.stop_id = '${selectedEntity.entity.vehicle!.stopId!}' LIMIT 1`,
        )
      )[0];
      setCurrentStop(stop);
      const stops: [] = await Query(
        `SELECT stops.stop_name, stop_times.arrival_time, stop_times.departure_time FROM stop_times INNER JOIN stops ON stop_times.stop_id = stops.stop_id WHERE stop_times.trip_id = '${selectedEntity.entity.vehicle!.trip!.tripId!}' AND stop_times.arrival_time > '${stop.arrival_time!}' ORDER BY stop_times.arrival_time`,
      );
      const diff = timeDiff(time, stop.arrival_time);
      if (diff == "00:00") {
        setDelay("");
      } else if (diff.startsWith("00:0")) {
        setDelay(diff.slice(-1));
      } else {
        setDelay(diff.slice(-2));
      }

      setCurrentStop(stop);
      setNextStops(stops);
      console.timeEnd("fetchNextStops");
    }

    fetchNextStops();
  }, [selectedEntity]);
  return (
    <>
      <div>
        <h1>Linia: {selectedEntity.data.route_short_name}</h1>
        <h1>Kierunek: {selectedEntity.data.trip_headsign}</h1>
        <h2>
          Aktualny przystanek: {currentStop?.stop_name} -{" "}
          {currentStop?.arrival_time?.slice(0, 5)}{" "}
          {delay !== "" && <span> + {delay}</span>}
        </h2>
        <p>Nastepne przystanki:</p>
        <div className="overflow-auto h-64">
          {nextStops.map((stop, index) => (
            <div
              key={index}
              className="border border-gray-300 mb-1 flex gap-2 p-1"
            >
              <p>{stop.stop_name}</p>
              <p>{stop.departure_time.slice(0, 5)}</p>
              {delay !== "" && <p> + {delay}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
