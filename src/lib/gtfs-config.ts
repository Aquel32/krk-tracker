// GTFS-RT
export const LIVE_FEEDS = [
  "https://gtfs.ztp.krakow.pl/VehiclePositions_T.pb",
  "https://gtfs.ztp.krakow.pl/VehiclePositions_A.pb",
  "https://gtfs.ztp.krakow.pl/VehiclePositions_M.pb",
];

// GTFS
export const STATIC_FEEDS = [
  "https://gtfs.ztp.krakow.pl/GTFS_KRK_A.zip",
  "https://gtfs.ztp.krakow.pl/GTFS_KRK_M.zip",
  "https://gtfs.ztp.krakow.pl/GTFS_KRK_T.zip",
];

// BY DEFAULT IMPORT ALL TABLES, YOU CAN SKIP SOME TABLES BY SETTING THEM TO FALSE WHEN DEBBUGING.
export const TABLES_TO_IMPORT: { [tableName: string]: boolean } = {
  "trips": true,
  "routes": true,
  "stops": true,
  "stop_times": true,
  "shapes": true,
  "calendar": true,
  "calendar_dates": true,
  "agency": true,
  "feed_info": true,
}