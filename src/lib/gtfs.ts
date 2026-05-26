"use server";

import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import AdmZip from "adm-zip";
import * as protobuf from "protobufjs";
import { createColumnsIfDoesntExist, getConnection } from "./db";
import * as fastcsv from "fast-csv";
import { Connection } from "mysql2/promise";

const LIVE_FEEDS = [
  "https://gtfs.ztp.krakow.pl/VehiclePositions_T.pb",
  "https://gtfs.ztp.krakow.pl/VehiclePositions_A.pb",
  "https://gtfs.ztp.krakow.pl/VehiclePositions_M.pb",
];

export async function getRealtimeData() {
  const entities: GtfsRealtimeBindings.transit_realtime.IFeedEntity[] = [];

  for (const feedUrl of LIVE_FEEDS) {
    const feedData = await decodeGtfs(feedUrl);
    entities.push(...feedData);
  }

  // TODO: GET RID OF THIS JSON STRINGIFY
  return JSON.stringify(entities);
}

type STATIC_FEED = {
  url: string;
  folder: string;
}

const STATIC_FEEDS: STATIC_FEED[] = [
  { url: "https://gtfs.ztp.krakow.pl/GTFS_KRK_A.zip", folder: "GTFS_KRK_A.zip" },
  { url: "https://gtfs.ztp.krakow.pl/GTFS_KRK_M.zip", folder: "GTFS_KRK_M.zip" },
  { url: "https://gtfs.ztp.krakow.pl/GTFS_KRK_T.zip", folder: "GTFS_KRK_T.zip" }
]

const TABLES_TO_IMPORT: { [tableName: string]: boolean } = {
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

export async function getStaticData() {
  const connection = await getConnection();
  await connection.connect();

  const cleanedTables = new Set<string>();

  for (const feed of STATIC_FEEDS) {
    const response = await fetch(feed.url);
    const arrayBuffer = await response.arrayBuffer();

    const zip = new AdmZip(Buffer.from(arrayBuffer));

    for (const entry of zip.getEntries()) {
      const tableName = entry.entryName.split(".")[0];
      const content = entry.getData().toString("utf8");

      if (TABLES_TO_IMPORT[tableName] !== true) {
        continue;
      }

      const csvData: any[] = [];

      const columns = content.replace(/\r/g, "").split("\n")[0].split(",");
      await createColumnsIfDoesntExist(tableName, columns);

      await new Promise<void>((resolve, reject) => {
        fastcsv
          .parseString(content, { headers: true })
          .on("error", reject)
          .on("data", (data) => {
            csvData.push(data);
          })
          .on("end", async () => {
            console.log(feed.folder, tableName, csvData.length);

            if (!cleanedTables.has(tableName)) {
              await connection.query(`TRUNCATE TABLE ${tableName}`);
              cleanedTables.add(tableName);
            }

            // getting columns from first row of csv
            const columns = csvData[0] ? Object.keys(csvData[0]) : [];

            // formating columns and values for sql query
            const formatedColumns = columns.map((c) => `\`${c}\``).join(", ");
            const values = csvData.map((row) => columns.map((c) => row[c] ?? null));
            const query = `INSERT INTO ${tableName} (${formatedColumns}) VALUES ?`;
            await connection.query(query, [values]);

            resolve();
          });
      });
    }
  }
}

export async function decodeGtfs(feedUrl: string) {
  const response = await fetch(feedUrl, {
    headers: {
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch GTFS-Realtime feed");
  }

  const arrayBuf = await response.arrayBuffer();

  try{
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(arrayBuf)
    );

    return feed.entity;
  }
  catch(e){
    console.error("Error decoding GTFS feed");
  }

  return [];
}