"use server";

import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import AdmZip from "adm-zip";
import { createColumnsIfDoesntExist, getConnection } from "./db";
import * as fastcsv from "fast-csv";
import { LIVE_FEEDS, STATIC_FEEDS, TABLES_TO_IMPORT } from "./gtfs-config";
import * as fs from "fs/promises";

const LAST_UPDATE_FILE = "last.json";
async function checkIfShouldUpdate()
{
  const now = new Date();

  try {
    const data = await fs.readFile(LAST_UPDATE_FILE, 'utf8');
    const parsed = JSON.parse(data);
    const lastUpdate = new Date(parsed.last);

    if(now.getTime() - lastUpdate.getTime() > 24 * 60 * 60 * 1000) // 24 hours
    {
      console.log("More than 24 hours since last update. Updating...");
      fs.writeFile(LAST_UPDATE_FILE, JSON.stringify({ last: now.toISOString() }));
      return true;
    }

    return false;
  } catch (err) {
    fs.writeFile(LAST_UPDATE_FILE, JSON.stringify({ last: now.toISOString() }));
    return true;
  }
}

export async function getRealtimeData() {
  const entities: GtfsRealtimeBindings.transit_realtime.IFeedEntity[] = [];

  for (const feedUrl of LIVE_FEEDS) {
    const feedData = await decodeGtfs(feedUrl);
    entities.push(...feedData);
  }

  // TODO: GET RID OF THIS JSON STRINGIFY (DOING IT BECAUSE OF SERVER TO CLIENT SERIALIZATION ISSUE)
  return JSON.stringify(entities);
}

export async function getStaticData() {
  // IN CASE OF ANY ISSUES AND IF YOU WANT TO CALL THIS FUNCTION MANUALLY
  // COMMENT OUT THIS CHECK BELOW.
  const shouldUpdate = await checkIfShouldUpdate();

  if(shouldUpdate === false)
  {
    return;
  }

  const connection = await getConnection();
  await connection.connect();

  const cleanedTables = new Set<string>();

  for (const feed of STATIC_FEEDS) {
    const response = await fetch(feed);
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
            console.log(tableName, csvData.length);

            if (!cleanedTables.has(tableName)) {
              await connection.query(`TRUNCATE TABLE ${tableName}`);
              cleanedTables.add(tableName);
            }

            const columns = csvData[0] ? Object.keys(csvData[0]) : [];

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