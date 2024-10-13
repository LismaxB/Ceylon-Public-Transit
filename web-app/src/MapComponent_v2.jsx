import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L, { Icon } from "leaflet";
import 'leaflet-routing-machine';

//styles
import "./App.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

function MapComponent({ driverLocations, route }) {
  const [map, setMap] = useState(null);
  const [busMarkers, setbusMarkers] = useState([]); // State to store markers
  const [routingMachine, setRoutingMachine] = useState(null);

  const busIcon = new Icon({
    iconUrl: "./bus.webp",
    iconSize: [30, 30],
  });

  const markericon = L.icon({
    iconUrl: './marker.webp',
    iconSize:[30,30]
});

  useEffect(() => {
    const setBusMarkers = driverLocations.map((driver) => (
      <Marker key={driver.driver_id} position={[driver.latitude, driver.longitude]} icon={busIcon}>
        <Popup>
          {driver.driver_id ? `${driver.driver_id}` : "BUS"}
        </Popup>
      </Marker>
    ));
    setbusMarkers(setBusMarkers);

    return () => {
      setbusMarkers([]);
    }
  }, [driverLocations]);

useEffect(() => {
  if (!map) return;

  // Remove existing routing control before adding a new one
  if (routingMachine) {
    map.removeControl(routingMachine);
  }

  // Create new routing control
  const routeStops = route.map((point) => L.latLng(point.latitude, point.longitude));

  const routingControl = L.Routing.control({
    waypoints: routeStops,
    createMarker: function(i, waypoint, nWps) {
      let icon;
      if (i === 0 || i === nWps - 1) {
        // Start and end marker
        icon = markericon;
      } else {
        // Intermediate stop markers
        icon = L.icon({
          iconUrl: './stop.webp',
          iconSize: [15, 15], // Adjust icon size if needed
        });
      }
      return L.marker(waypoint.latLng, {
        draggable: false,
        icon: icon,
      });
    },
  });

  routingControl.addTo(map);
  setRoutingMachine(routingControl);

  // Clean up on component unmount or when route/map changes
  return () => {
    if (routingControl) {
      map.removeControl(routingControl);
    }
  };
}, [map, route]);


  return (
    <MapContainer 
    center={[6.9, 79.94]} 
    zoom={13} 
    scrollWheelZoom={true} 
    ref={setMap} 
    id="map" 
    style={{ height: '100vh', width: '100%', padding: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />.
      {busMarkers}
    </MapContainer>
  );
}

export default MapComponent;
