"use client";
import React, { useEffect, useState } from "react";

import { MapContainer, TileLayer, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import L, { Icon, Marker } from "leaflet";

import "leaflet.marker.slideto";

import RoutingPanel from "./RoutingPanel";

// Extend Leaflet to include Routing
import "leaflet-routing-machine";
declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
  }

  interface Marker {
    slideTo(latlng: LatLngExpression, options?: any): this;
  }
}

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { supabase } from "../supabaseClient";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom: number;
}

const MapComponent = (Map: MapProps) => {
  const [map, setMap] = useState<L.Map | null>(null);

  const busIcon = new Icon({
    iconUrl: "./images/icons/bus.webp",
    iconSize: [30, 30],
  });

  const busMap: { [key: string]: { marker: L.Marker; data: any } } = {};

  useEffect(() => {
    async function fetchBusData() {
      const { data, error } = await supabase
        .from("DriverLocations")
        .select("*")
        .order("timestamp", { ascending: false }); // This ensures that we get the most recent locations first

      if (error) {
        console.log({ error: error.message });
        return;
      }

      // Create a set of current driver IDs
      const currentDrivers = new Set(data?.map((bus) => bus.driver_id));

      // Remove drivers not in the current data
      Object.keys(busMap).forEach((driverId) => {
        if (!currentDrivers.has(driverId) && map) {
          // Remove the marker from the map
          map.removeLayer(busMap[driverId].marker);
          delete busMap[driverId]; // Remove from busMap
        }
      });

      // Store the latest location for each driver
      const latestBusData: { [key: string]: any } = {};

      data?.forEach((bus) => {
        const { driver_id, latitude, longitude } = bus;

        // If the driver ID already exists, only keep the most recent one
        if (
          !latestBusData[driver_id] ||
          new Date(bus.timestamp) > new Date(latestBusData[driver_id].timestamp)
        ) {
          latestBusData[driver_id] = bus; // Store the latest location based on timestamp
        }
      });

      // Update the map with the latest data
      Object.values(latestBusData).forEach((bus) => {
        const { driver_id, latitude, longitude } = bus;
        const busLatLng = L.latLng(latitude, longitude);

        // Check if the driver already exists in the busMap
        if (busMap[driver_id]) {
          // If the location has changed, slide the marker to the new location
          if (
            busMap[driver_id].data.latitude !== latitude ||
            busMap[driver_id].data.longitude !== longitude
          ) {
            busMap[driver_id].marker.slideTo(busLatLng, {
              duration: 3000, // Adjust animation duration as needed
            });
          }
          // Update the stored data
          busMap[driver_id].data = bus; // Keep the latest data
        } else {
          // Create a new marker for the new driver location
          if (!map) return;
          const marker = L.marker(busLatLng, { icon: busIcon })
            .addTo(map)
            .bindPopup(`Driver: ${driver_id}`);
          // Store the marker and data in busMap
          busMap[driver_id] = { marker, data: bus };
        }
      });
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
    };
  }, [map]);

  return (
    <div className="flex h-[calc(100vh-100px)] w-full">
      <RoutingPanel map={map} />
      <MapContainer
        center={[6.9, 79.94]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        ref={setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
