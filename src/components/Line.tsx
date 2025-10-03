export default function Line({
  selectedEntity,
  data,
}: {
  selectedEntity: { entity: any; data: any };
  data: any;
}) {
  // selectedEntity.entity.vehicle.stopId
  // selectedEntity.entity.vehicle.trip.tripId
  // stops.find((s) => s.stop_id === selectedEntity.entity.vehicle.stopId)

  return (
    <>
      <div>
        <h1>Przystanki:</h1>
        <ul>
          {/* {data.stop_times
            .filter(
              (st) => st.trip_id === selectedEntity.entity.vehicle.trip.tripId
            )
            .map((st) => {
              const stop = data.stops.find((s) => s.stop_id === st.stop_id);
              return (
                <li
                  key={st.stop_id}
                  className={
                    stop.stop_id === selectedEntity.entity.vehicle.stopId
                      ? "text-green-800"
                      : ""
                  }
                >
                  {stop
                    ? `${stop.stop_name} - ${st.departure_time}`
                    : "Unknown Stop"}
                </li>
              );
            })} */}
        </ul>
      </div>
    </>
  );
}
