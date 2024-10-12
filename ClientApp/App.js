import { createClient } from '@supabase/supabase-js';
import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL, 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export default function App() {
  const [buses, setBuses] = useState([]);
  const [route, setRoute] = useState([]);
  
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

  const fetchRoute = async () => {
    const { data, error } = await supabase
      .from('Routes')
      .select('*');
    
    if (!error) {
      // console.log(data[0].AtoBstops);
      try {
        for(let i = 0; i < data[0].AtoBstops.length; i++) {
          const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${data[0].AtoBstops[i].longitude},${data[0].AtoBstops[i].latitude};${data[0].AtoBstops[i+1].longitude},${data[0].AtoBstops[i+1].latitude}?overview=full&geometries=geojson`);
          const routedata = await response.json();
          const exactRoute = routedata.routes[0]?.geometry.coordinates || [];
          const decodedPath = exactRoute.map(([lng, lat]) => ({
            latitude: lat,
            longitude: lng
          }));
          setRoute(prevRoute => [...prevRoute, ...decodedPath]); // Store the correctly formatted route
        }
        // const response = await fetch(`https://router.project-osrm.org/route/v1/driving/79.983355,6.936209;79.849057,6.911111?overview=full&geometries=geojson`);
        // const routedata = await response.json();
        // const exactRoute = routedata.routes[0]?.geometry.coordinates || [];
        // const decodedPath = exactRoute.map(([lng, lat]) => ({
        //   latitude: lat,
        //   longitude: lng
        // }));
        // setRoute(decodedPath); // Store the correctly formatted route
      } catch (fetchError) {
        // console.error("Error fetching route:", fetchError);
      }
    }
  };

  useEffect(() => {
    fetchBusData();
    fetchRoute();

    // Optionally, set an interval to update buses every 5 seconds
    const intervalId = setInterval(fetchBusData, 5000); // update every 5 seconds
    return () => clearInterval(intervalId); // clear on component unmount
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        mapType="mutedStandard"
        initialRegion={{
          latitude: 6.9,  // Default latitude (Sri Lanka, Colombo)
          longitude: 79.93, // Default longitude (Sri Lanka, Colombo)
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
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
            <Image
              source={require('./assets/bus.webp')} // Custom marker image
              style={{ width: 30, height: 30 }} // Adjust the size here
            />
          </Marker>
        ))}

        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeColor="#0000FF" // Customize route color (blue)
            strokeWidth={6} // Customize route width
            lineCap="round"
            lineJoin="round"
            geodesic={true}
          />
        )}
      </MapView>
    </View>
  );
}
