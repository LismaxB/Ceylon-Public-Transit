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
  const [route, setRoute] = useState([]);

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

    const fetchRoute = async () => {
      const { data, error } = await supabase
        .from('Routes')
        .select('*');
      
      if (!error) {
        setRoute(data[0].stops);
      }
    };

    fetchRoute();

  }, []);

  return (
    <div>
      <h1>Driver Location Tracking</h1>
      <MapComponent driverLocations={driverLocations} route={route}/>
    </div>
  );
}

export default App;
