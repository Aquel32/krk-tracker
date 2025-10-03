export default function Stop({
  selectedStop,
  data,
}: {
  selectedStop: { stop: any };
  data: any;
}) {
  return (
    <>
      <div>
        <h1>Przystanek: {selectedStop.stop.stop_name}</h1>
        <p>Najbliższe odjazdy:</p>
        <ul></ul>
      </div>
    </>
  );
}
