import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import { createClient } from '@supabase/supabase-js';

console.log(process.env.SUPABASE_URL);

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL, 
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function App() {
  const [driverLocations, setDriverLocations] = useState([]);

    // Define your route here with latitude and longitude of waypoints
    const route = [
      { latitude: 6.936209262083772, longitude: 79.98335480690004 }, // Starting point
      { latitude: 6.9040229148738606, longitude: 79.9544405937195 }, // Malabe
      { latitude: 6.910051365238273, longitude: 79.89450931549074 }, // Rajagiriya
      { latitude: 6.911111129047056, longitude: 79.84905660152437 },    // Ending point or intermediate waypoints
      // Add more waypoints as needed
    ];

  // Fetch driver locations from Supabase
  useEffect(() => {
    const fetchDriverLocations = async () => {
      const { data, error } = await supabase
        .from('Driver Locations')
        .select('*');
      
      if (!error) {
        setDriverLocations(data);
      }
    };

    fetchDriverLocations();

    // // Fetch every 5 seconds
    // const intervalId = setInterval(fetchDriverLocations, 5000);

    // // Clean up the interval on component unmount
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Driver Location Tracking</h1>
      <MapComponent driverLocations={driverLocations} route={route}/>
    </div>
  );
}

export default App;
