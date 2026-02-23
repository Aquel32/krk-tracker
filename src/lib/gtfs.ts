"use server";

import * as protobuf from "protobufjs";

const root = await protobuf.load("./src/lib/gtfs-realtime.proto");
const FeedMessage = root.lookupType("transit_realtime.FeedMessage");

export async function decodeGtfs(feedUrl: string) {
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

  return obj;
}