import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';  // Leaflet's CSS

const MapComponent = ({ driverLocations }) => {
  useEffect(() => {
    // Create a map instance
    const map = L.map('map').setView([6.9271, 79.8612], 13); // Center the map (Colombo)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Plot driver markers
    driverLocations.forEach(driver => {
      L.marker([driver.latitude, driver.longitude])
        .addTo(map)
        .bindPopup(`Driver ID: ${driver.driver_id}`)
        .openPopup();
    });

    // Cleanup on component unmount
    return () => map.remove();
  }, [driverLocations]);

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default MapComponent;
