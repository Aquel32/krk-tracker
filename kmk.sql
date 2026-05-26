-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Maj 26, 2026 at 06:56 PM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kmk`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `agency`
--

CREATE TABLE `agency` (
  `agency_id` text DEFAULT NULL,
  `agency_name` text DEFAULT NULL,
  `agency_url` text DEFAULT NULL,
  `agency_timezone` text DEFAULT NULL,
  `agency_lang` text DEFAULT NULL,
  `agency_phone` text DEFAULT NULL,
  `agency_fare_url` text DEFAULT NULL,
  `agency_email` text DEFAULT NULL,
  `﻿agency_id` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `calendar`
--

CREATE TABLE `calendar` (
  `service_id` text DEFAULT NULL,
  `monday` text DEFAULT NULL,
  `tuesday` text DEFAULT NULL,
  `wednesday` text DEFAULT NULL,
  `thursday` text DEFAULT NULL,
  `friday` text DEFAULT NULL,
  `saturday` text DEFAULT NULL,
  `sunday` text DEFAULT NULL,
  `start_date` text DEFAULT NULL,
  `end_date` text DEFAULT NULL,
  `﻿service_id` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `calendar_dates`
--

CREATE TABLE `calendar_dates` (
  `service_id` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `exception_type` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `feed_info`
--

CREATE TABLE `feed_info` (
  `feed_publisher_name` text DEFAULT NULL,
  `feed_publisher_url` text DEFAULT NULL,
  `feed_lang` text DEFAULT NULL,
  `feed_start_date` text DEFAULT NULL,
  `feed_end_date` text DEFAULT NULL,
  `feed_version` text DEFAULT NULL,
  `﻿feed_publisher_name` text DEFAULT NULL,
  `feed_contact_email` text DEFAULT NULL,
  `feed_contact_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `routes`
--

CREATE TABLE `routes` (
  `route_id` text DEFAULT NULL,
  `agency_id` text DEFAULT NULL,
  `route_short_name` text DEFAULT NULL,
  `route_long_name` text DEFAULT NULL,
  `route_desc` text DEFAULT NULL,
  `route_type` text DEFAULT NULL,
  `route_url` text DEFAULT NULL,
  `route_color` text DEFAULT NULL,
  `route_text_color` text DEFAULT NULL,
  `route_sort_order` text DEFAULT NULL,
  `continuous_pickup` text DEFAULT NULL,
  `continuous_drop_off` text DEFAULT NULL,
  `route_branding_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `shapes`
--

CREATE TABLE `shapes` (
  `shape_id` varchar(64) NOT NULL,
  `shape_pt_lat` text DEFAULT NULL,
  `shape_pt_lon` text DEFAULT NULL,
  `shape_pt_sequence` int(11) DEFAULT NULL,
  `shape_dist_traveled` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `stops`
--

CREATE TABLE `stops` (
  `stop_id` varchar(64) NOT NULL,
  `stop_code` text DEFAULT NULL,
  `stop_name` text DEFAULT NULL,
  `stop_desc` text DEFAULT NULL,
  `stop_lat` text DEFAULT NULL,
  `stop_lon` text DEFAULT NULL,
  `zone_id` text DEFAULT NULL,
  `stop_url` text DEFAULT NULL,
  `location_type` text DEFAULT NULL,
  `parent_station` text DEFAULT NULL,
  `stop_timezone` text DEFAULT NULL,
  `wheelchair_boarding` text DEFAULT NULL,
  `platform_code` text DEFAULT NULL,
  `﻿stop_id` text DEFAULT NULL,
  `stop_name_stem` text DEFAULT NULL,
  `town_name` text DEFAULT NULL,
  `street_name` text DEFAULT NULL,
  `street` text DEFAULT NULL,
  `city` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `stop_times`
--

CREATE TABLE `stop_times` (
  `trip_id` text DEFAULT NULL,
  `arrival_time` text DEFAULT NULL,
  `departure_time` time DEFAULT NULL,
  `stop_id` varchar(64) NOT NULL,
  `stop_sequence` text DEFAULT NULL,
  `stop_headsign` text DEFAULT NULL,
  `pickup_type` text DEFAULT NULL,
  `drop_off_type` text DEFAULT NULL,
  `shape_dist_traveled` text DEFAULT NULL,
  `timepoint` text DEFAULT NULL,
  `continuous_pickup` text DEFAULT NULL,
  `continuous_drop_off` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `trips`
--

CREATE TABLE `trips` (
  `trip_id` text DEFAULT NULL,
  `route_id` text DEFAULT NULL,
  `service_id` text DEFAULT NULL,
  `trip_headsign` text DEFAULT NULL,
  `trip_short_name` text DEFAULT NULL,
  `direction_id` text DEFAULT NULL,
  `block_id` text DEFAULT NULL,
  `shape_id` text DEFAULT NULL,
  `wheelchair_accessible` text DEFAULT NULL,
  `bikes_allowed` text DEFAULT NULL,
  `exceptional` text DEFAULT NULL,
  `block_short_name` text DEFAULT NULL,
  `variant_code` text DEFAULT NULL,
  `fleet_type` text DEFAULT NULL,
  `brigade` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `calendar_dates`
--
ALTER TABLE `calendar_dates`
  ADD UNIQUE KEY `idx_calendar_dates_service_date` (`service_id`(64),`date`);

--
-- Indeksy dla tabeli `routes`
--
ALTER TABLE `routes`
  ADD UNIQUE KEY `route_id` (`route_id`) USING HASH,
  ADD KEY `idx_routes_route_id` (`route_id`(64));

--
-- Indeksy dla tabeli `shapes`
--
ALTER TABLE `shapes`
  ADD KEY `idx_shapes_shape_seq` (`shape_id`,`shape_pt_sequence`);

--
-- Indeksy dla tabeli `stops`
--
ALTER TABLE `stops`
  ADD UNIQUE KEY `stop_ip` (`stop_id`),
  ADD KEY `idx_stops_stop_id` (`stop_id`);

--
-- Indeksy dla tabeli `stop_times`
--
ALTER TABLE `stop_times`
  ADD UNIQUE KEY `idx_stop_times_trip_departure_time` (`trip_id`(64),`departure_time`),
  ADD KEY `idx_stop_times_trip_stop` (`trip_id`(64),`stop_id`),
  ADD KEY `idx_stop_times_trip_arrival` (`trip_id`(64),`arrival_time`(16)),
  ADD KEY `idx_stop_times_stop_departure` (`stop_id`,`departure_time`);

--
-- Indeksy dla tabeli `trips`
--
ALTER TABLE `trips`
  ADD UNIQUE KEY `trip_id` (`trip_id`) USING HASH,
  ADD KEY `idx_trips_trip_id` (`trip_id`(64)),
  ADD KEY `idx_trips_route_id` (`route_id`(64));
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
