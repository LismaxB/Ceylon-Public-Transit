"use client";
import React from "react";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom: number;
}

const MapComponent = (Map: MapProps) => {
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
      <Marker position={[6.9, 79.94]} draggable={false}></Marker>
    </MapContainer>
  );
};

export default MapComponent;
