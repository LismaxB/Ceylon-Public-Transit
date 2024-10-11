import { createClient } from '@supabase/supabase-js';
import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL, 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export default function App() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    // Fetch buses from Supabase on load
    const fetchBusData = async () => {
      const { data, error } = await supabase
        .from('Driver Locations')
        .select('driver_id, latitude, longitude');

      if (error) {
        console.error(error);
      } else {
        setBuses(data);
      }
    };

    fetchBusData();
    

    // Optionally, set an interval to update buses every X seconds
    const intervalId = setInterval(fetchBusData, 5000); // update every 5 seconds
    return () => clearInterval(intervalId); // clear on component unmount
    
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 7.8731,  // Default latitude (Sri Lanka)
          longitude: 80.7718, // Default longitude (Sri Lanka)
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {buses.map(bus => (
          <Marker
            key={bus.driver_id}
            coordinate={{
              latitude: bus.latitude,
              longitude: bus.longitude,
            }}
            title={`Bus ${bus.driver_id}`}
          >
            {/* Custom marker icon with size adjustment */}
            <Image
              key={bus.driver_id}
              source={require('./assets/bus.webp')} // Custom marker image
              style={{ width: 30, height: 30 }} // Adjust the size here
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}
