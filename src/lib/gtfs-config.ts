export const LIVE_FEEDS = [
  "https://gtfs.ztp.krakow.pl/VehiclePositions_T.pb",
  "https://gtfs.ztp.krakow.pl/VehiclePositions_A.pb",
  "https://gtfs.ztp.krakow.pl/VehiclePositions_M.pb",
];

export const STATIC_FEEDS = [
  "https://gtfs.ztp.krakow.pl/GTFS_KRK_A.zip",
  "https://gtfs.ztp.krakow.pl/GTFS_KRK_M.zip",
  "https://gtfs.ztp.krakow.pl/GTFS_KRK_T.zip",
];

export const TABLES_TO_IMPORT: { [tableName: string]: boolean } = {
  "trips": false,
  "routes": false,
  "stops": false,
  "stop_times": false,
  "shapes": false,
  "calendar": false,
  "calendar_dates": false,
  "agency": true,
  "feed_info": true,
}