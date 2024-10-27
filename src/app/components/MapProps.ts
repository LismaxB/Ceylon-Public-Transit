"use client";

import { LatLngExpression, LatLngTuple } from "leaflet";

export interface Bus {
  id: string;
  bus_number: string;
  capacity: number;
  bus_type: string;
  private: boolean;
  active: boolean;
  bus_id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  route_id: string;
}

export interface RoutingProps {
  map: L.Map | null;
  selectedBus: Bus | null;
}
export interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom: number;
}

export interface RouteSummary {
  distance: number; // in meters
  duration: number; // in seconds
  steps: Array<{ instructions: string; distance: number }>;
}
