"use client";
import React, { useEffect, useState } from "react";

import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import L, { Icon } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom: number;
}

const MapComponent = (Map: MapProps) => {
  const [busData, setBusData] = useState<any[]>([]);
  const [busMarkers, setBusMarkers] = useState<JSX.Element[]>([]);

  const busIcon = new Icon({
    iconUrl: "./images/icons/bus.webp",
    iconSize: [30, 30],
  });

  const markericon = L.icon({
    iconUrl: "./marker.webp",
    iconSize: [30, 30],
  });

  const busMap: { [key: string]: any } = {};

  useEffect(() => {
    async function fetchBusData() {
      const { data, error } = await supabase
        .from("DriverLocations")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        console.log({ error: error.message });
      }
      data?.forEach((bus) => {
        if (
          !busMap[bus.driver_id] ||
          new Date(bus.timestamp) > new Date(busMap[bus.driver_id].timestamp)
        ) {
          busMap[bus.driver_id] = bus; // Keep the latest location
        }
      });
      const BusData = Object.values(busMap); // Convert the map back to an array

      const markers =
        BusData?.map(
          (driver: {
            driver_id: string;
            latitude: number;
            longitude: number;
          }) => (
            <Marker
              key={driver.driver_id}
              position={[driver.latitude, driver.longitude]}
              icon={busIcon}
            >
              <Popup>
                {driver.driver_id ? `Driver: ${driver.driver_id}` : "Bus"}
              </Popup>
            </Marker>
          )
        ) || [];
      setBusMarkers(markers);
    }

    fetchBusData();
    // Subscribe to real-time updates for driver locations
    const subscription = supabase
      .channel("real-time-bus-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "*",
          table: "DriverLocations",
        },
        (payload) => {
          fetchBusData();
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
      setBusMarkers([]);
    };
  }, []);

  return (
    <MapContainer
      center={[6.9, 79.94]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {busMarkers}
    </MapContainer>
  );
};

export default MapComponent;
