import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent_v2';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL, 
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function App() {
  const [driverLocations, setDriverLocations] = useState([]);
  const [route, setRoute] = useState([]);

  const busMap = {};

  const groupBusesById = (busData) => {
    busData.forEach(bus => {
      if (!busMap[bus.driver_id] || new Date(bus.timestamp) > new Date(busMap[bus.driver_id].timestamp)) {
        busMap[bus.driver_id] = bus;  // Keep the latest location
      }
    });
    return Object.values(busMap);  // Convert the map back to an array
  };

  // Fetch driver locations from Supabase
  useEffect(() => {
    const fetchDriverLocations = async () => {
      const { data, error } = await supabase
        .from('DriverLocations')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (!error) {
        const uniqueBuses = groupBusesById(data);
        setDriverLocations(uniqueBuses);
        // setDriverLocations(data);
      }
    };

    fetchDriverLocations();

    // // Fetch every 5 seconds
    // const intervalId = setInterval(fetchDriverLocations, 5000);

    // // Clean up the interval on component unmount
    // return () => clearInterval(intervalId);

    // Subscribe to real-time updates for driver locations
    const subscription = supabase
    .channel('real-time-bus-updates')
    .on('postgres_changes',{
      event: '*',
      schema: '*',
      table: 'DriverLocations',
    }, (payload) => {
      console.log('Change received!', payload);
      fetchDriverLocations();
    }).subscribe();

    const fetchRoute = async () => {
      const { data, error } = await supabase
        .from('Routes')
        .select('*');
      
      if (!error) {
        setRoute(data[0].AtoBstops);
      }
    };

    fetchRoute();

    // Clean up the subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Driver Location Tracking</h1>
      <MapComponent driverLocations={driverLocations} route={route}/>
    </div>
  );
}

export default App;
