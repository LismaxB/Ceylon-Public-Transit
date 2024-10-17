"use client";
import React, { useEffect, useState } from "react";

import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import L, { Icon } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

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

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await fetch("/api/realtimeBusData");
        const data = await response.json();
        setBusData(data);

        // Set markers based on the fetched bus data
        const markers = data.map(
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
        );
        setBusMarkers(markers);
      } catch (err) {
        console.error("Error fetching bus data:", err);
      }
    };

    fetchBusData();

    return () => {
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
