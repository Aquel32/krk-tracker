import * as protobuf from "protobufjs";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

let root: protobuf.Root | null = null;

async function getRoot(): Promise<protobuf.Root> {
  if (root) return root;

  root = await protobuf.load("./src/lib/gtfs-realtime.proto");

  return root;
}

export async function decodeGtfs(feedUrl: string) {
  const root = await getRoot();

  const FeedMessage = root.lookupType("transit_realtime.FeedMessage");

  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch GTFS-Realtime feed");
  }
  
  const arrayBuf = await response.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuf);
  
  const msg = FeedMessage.decode(uint8);

  const obj = FeedMessage.toObject(msg, {
    longs: Number,
    enums: String,
    bytes: String, 
    defaults: true,
    arrays: true,
    objects: true,
  });

  //console.log(JSON.stringify(obj, null, 2));

  return obj;
}

export async function parseGtfsFile(filename: string) {
  const filePath = path.join(process.cwd(), "src/lib/GTFS_KRK_T", filename);
  const fileContent = fs.readFileSync(filePath, "utf8");

  const result = Papa.parse(fileContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  //console.log(JSON.stringify(result.data, null, 2));

  return result.data;
}