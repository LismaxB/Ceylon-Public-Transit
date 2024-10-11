// MapComponent.js
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

const MapComponent = ({ driverLocations, route }) => {
  useEffect(() => {
    const map = L.map('map').setView([6.9271, 79.8612], 13); // Center the map (Colombo)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Clear any existing markers
    const markers = [];

    const markericon = L.icon({
        iconUrl: './marker.webp',
        iconSize:[30,30]
    });

    // L.Icon.Default.prototype.options = {
    //     icon: markericon,
    //     draggable: false,
    //    };

    // Plot driver markers
    driverLocations.forEach(driver => {

        let iconOptions = {
            title:driver.driver_id,
            draggable:false,
            icon: L.icon({
                iconUrl: './bus.webp',
                iconSize:[30,30]
            }),
           }
        
      const marker = L.marker([driver.latitude, driver.longitude],iconOptions)
        .addTo(map)
        .bindPopup(`Driver ID: ${driver.driver_id}`)
        .openPopup();

      markers.push(marker);
    });

    // Add the route if it exists
    if (route && route.length > 0) {

      const waypoints = route.map(point => L.latLng(point.latitude, point.longitude));

      // Create a routing control with the geocoder
    const routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: false,
      geocoder: L.Control.Geocoder.nominatim(),
      summaryTemplate: '<div><b>177 | Kaduwela - Kollupitiya</b></div><div>Distance: {distance} | Duration: {time}</div>',
      createMarker: function(i, waypoint, nWps) {
        let icon;
        if (i === 0 || i === nWps - 1) {
        // Use the default marker icon for the start and end points
        icon = markericon;
        } else {
        // Use a different icon for intermediate stops
        icon = L.icon({
          iconUrl: './stop.webp',
          iconSize: 15,
          iconScale: false,
        });
        }
        return L.marker(waypoint.latLng, {
        draggable: false,
        icon: icon,
        });
      },
    }).addTo(map);

      // Optional: Fit the map bounds to the waypoints
      map.fitBounds(routingControl.getWaypoints().map(waypoint => waypoint.latLng));
    }

    return () => {
      // Clean up: remove markers and routing control
      markers.forEach(marker => map.removeLayer(marker));
      map.eachLayer((layer) => {
        if (layer instanceof L.Routing.Control) {
          map.removeControl(layer);
        }
      });
      map.remove();
    };
  }, [driverLocations, route]);

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default MapComponent;
