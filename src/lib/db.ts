"use server";

import { Database } from "duckdb-async";
import { NextRequest, NextResponse } from "next/server";

const db = await Database.create(":memory:");
await db.all(`CREATE TABLE routes AS SELECT * FROM read_csv('./src/lib/GTFS_KRK_T/routes.csv', sample_size = -1)`);
await db.all(`CREATE TABLE trips AS SELECT * FROM read_csv('./src/lib/GTFS_KRK_T/trips.csv', sample_size = -1)`);
await db.all(`CREATE TABLE stops AS SELECT * FROM read_csv('./src/lib/GTFS_KRK_T/stops.csv', sample_size = -1)`);
await db.all(`CREATE TABLE stop_times AS SELECT * FROM read_csv('./src/lib/GTFS_KRK_T/stop_times.csv', sample_size = -1)`);

export async function Query(sql: string) {
    const rows = await db.all(sql);
    return rows;
}