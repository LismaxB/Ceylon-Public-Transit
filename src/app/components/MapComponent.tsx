"use client";
import React, { useEffect, useState } from "react";

import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import L, { Icon } from "leaflet";

// Extend Leaflet to include Routing
import "leaflet-routing-machine";
declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
  }
}

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

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
  const [map, setMap] = useState<L.Map | null>(null);
  const [busData, setBusData] = useState<any[]>([]);
  const [busMarkers, setBusMarkers] = useState<JSX.Element[]>([]);
  const [routingMachine, setRoutingMachine] = useState(null);

  const busIcon = new Icon({
    iconUrl: "./images/icons/bus.webp",
    iconSize: [30, 30],
  });

  const markericon = L.icon({
    iconUrl: "./images/icons/marker.webp",
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

      // Clear the busMap
      Object.keys(busMap).forEach((key) => delete busMap[key]);

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

  useEffect(() => {
    if (!map) return;

    const fetchRoute = async () => {
      const { data, error } = await supabase.from("Routes").select("*");

      if (error) {
        console.error("Error fetching route data:", error);
        return;
      }

      if (!data || data.length === 0) {
        console.error("No route data available");
        return;
      }

      const route = data[0].AtoBstops;

      // Remove existing routing control before adding a new one
      if (routingMachine) {
        map.removeControl(routingMachine);
      }

      // Create new routing control
      const routeStops = route.map(
        (point: { latitude: number; longitude: number }) =>
          L.latLng(point.latitude, point.longitude)
      );

      const routingControl = L.Routing.control({
        waypoints: routeStops,
        routeWhileDragging: false,
        addWaypoints: false,
        name: data[0].route_name,
        createMarker: function (
          i: number,
          waypoint: { latLng: LatLngExpression },
          nWps: number
        ) {
          let icon;
          if (i === 0 || i === nWps - 1) {
            // Start and end marker
            icon = markericon;
          } else {
            // Intermediate stop markers
            icon = L.icon({
              iconUrl: "./images/icons/stop.webp",
              iconSize: [15, 15], // Adjust icon size if needed
            });
          }
          return L.marker(waypoint.latLng, {
            draggable: false,
            icon: icon,
          });
        },
        lineOptions: {
          styles: [{ color: "#FF6666", weight: 4 }],
        },
      });

      routingControl.addTo(map);
      setRoutingMachine(routingControl);
    };

    fetchRoute();

    // Clean up on component unmount or when route/map changes
    return () => {
      if (routingMachine) {
        map.removeControl(routingMachine);
      }
    };
  }, [map]);

  return (
    <MapContainer
      center={[6.9, 79.94]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
      ref={setMap}
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
