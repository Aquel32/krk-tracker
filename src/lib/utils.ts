export function timeDiff(startTime: string, endTime: string) {
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

export function timeToNumber(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}