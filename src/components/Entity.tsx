import { Query } from "@/lib/db";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  setShapes,
}: {
  selectedEntity: {
    entity: GtfsRealtimeBindings.transit_realtime.FeedEntity;
    data: any;
  };
  setShapes: Dispatch<SetStateAction<[number, number][]>>;
}) {
  const [nextStops, setNextStops] = useState<any[]>([]);
  const [currentStop, setCurrentStop] = useState<any>(null);
  const [delay, setDelay] = useState("");

  useEffect(() => {
    async function fetchShapes() {
      console.time("fetchShapes");
      const shapes = await Query(
        `SELECT shape_pt_lat, shape_pt_lon FROM shapes WHERE shape_id = '${selectedEntity.data.shape_id}' ORDER BY shape_pt_sequence`,
      );
      setShapes(
        shapes.map((s: any) => [
          parseFloat(s.shape_pt_lat),
          parseFloat(s.shape_pt_lon),
        ]),
      );
      console.timeEnd("fetchShapes");
    }

    async function fetchNextStops() {
      console.time("fetchNextStops");

      const time = new Date().toTimeString().split(" ")[0];
      const stop = (
        await Query(
          `SELECT stops.stop_name, stop_times.arrival_time, stop_times.departure_time, stop_desc FROM stops INNER JOIN stop_times ON stops.stop_id = stop_times.stop_id WHERE stop_times.trip_id = '${selectedEntity.entity.vehicle!.trip!.tripId!}' AND stop_times.stop_id = '${selectedEntity.entity.vehicle!.stopId!}' LIMIT 1`,
        )
      )[0];
      setCurrentStop(stop);
      const stops: [] = await Query(
        `SELECT stops.stop_name, stop_times.arrival_time, stop_times.departure_time, stop_desc, zone_id FROM stop_times INNER JOIN stops ON stop_times.stop_id = stops.stop_id WHERE stop_times.trip_id = '${selectedEntity.entity.vehicle!.trip!.tripId!}' AND stop_times.arrival_time > '${stop.arrival_time!}' ORDER BY stop_times.arrival_time`,
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

    if (selectedEntity.data) {
      fetchNextStops();
      fetchShapes();
    } else {
      setDelay("");
      setCurrentStop(null);
      setNextStops([]);
      setShapes([]);
    }
  }, [selectedEntity]);
  return (
    <>
      <div className="bg-gray-950 p-4 border border-gray-500 z-10 text-white flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              {selectedEntity.data ? selectedEntity.data.route_short_name : "?"}
            </h1>
            <h1 className="text-lg">
              {selectedEntity.data ? selectedEntity.data.trip_headsign : "?"}
            </h1>
          </div>

          <p className="text-sm text-gray-300 ml-5">
            {selectedEntity.entity.vehicle?.vehicle?.licensePlate}
          </p>
        </div>
        <div className="flex items-center justify-between border-b-2 border-gray-500">
          <div className="flex gap-1">
            <h2>{currentStop?.stop_name}</h2>
            <h2 className="text-sm text-gray-300">{currentStop?.stop_desc}</h2>
          </div>
          <p>
            {currentStop?.arrival_time?.slice(0, 5)}{" "}
            {delay !== "" && <span className="text-red-400">+ {delay}</span>}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-300">Nastepne:</p>
          <div className="overflow-auto h-64 px-2">
            {selectedEntity.data &&
              nextStops.map((stop, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <h2>{stop.stop_name}</h2>
                    <h2 className="text-sm text-gray-300">{stop.stop_desc}</h2>
                  </div>
                  <p>
                    {stop.departure_time.slice(0, 5)}{" "}
                    {delay !== "" && (
                      <span className="text-red-400">+ {delay}</span>
                    )}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
