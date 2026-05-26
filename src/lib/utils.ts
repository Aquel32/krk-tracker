export function timeDiff(startTime: string, endTime: string) {
  let diff = Math.floor(
    Math.abs(timeToNumber(endTime.slice(0, 5)) - timeToNumber(startTime.slice(0, 5))),
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