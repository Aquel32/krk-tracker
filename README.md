# krk-tracker

Simple Kraków's *(but not only)* real time public transport tracker.

Made in `nextjs` and `react`. Uses `gtfs-realtime-bindings` to parse [GTFS](https://gtfs.org) life feed.

Inspired by https://odjazdowykrakow.pl/

## Features

- Rendering map, vehicle locations and stop markers using `react-leaflet`

- You can select any vehicle to see its destination, upcoming stops and live arrival times with calculated delays.

- Drawing route path of selected vehicle on map

- Zooming in reveals stop markers. *(In Kraków, the database has tons of separate records for a single real-life stop, so they are automatically grouped here)*

- You can click a stop to see upcoming departures, with real-time arrivals and delays

## Setup

Import `kmk.sql` into your Maria DB server.

>The application automatically updates static GTFS data into the database.
>Because GTFS feeds can contain millions of records, you must increase `"max_allowed_packet"` value in your DB config. Setting it to `"10000M"` works perfectly.

Copy `example.env` to a new file named `.env` and fill with your DB details.
You can configure the map provider here. By default, it uses OpenStreetMap, but you can swap it for any other map API
*I've found some cool maps on [MapTiler](https://cloud.maptiler.com/maps/)*

You can also customize marker colors in `src/components/Map.tsx`.

Initial boot (and every 24 hours after) triggers a GTFS static data update. Be patient, loading entire database can take a while :)

## Known Issues / TODO

- ISSUE: Proccesing stop data takes A LOT of time and needs to be optimized!!!
- ISSUE: Currently some data can dissapear from stop panel right after real-time data fetch.
- TODO: Some vehicles appear as "N/A" if they are still finishing a previous trip when you check a stop on their next route.
- TODO: Make UI responsive for mobile devices

Even though many cities use GTFS, implementation can vary and adopting this tracker to a city other than Kraków might might force you to do some changes