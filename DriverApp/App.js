import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Alert, Pressable } from 'react-native';

import { supabase } from './supabaseClient';

import * as Location from 'expo-location';

export default function App() {
    console.log("Starting App");

    let isRideStarted = false;

    const signIn = async (email, password) => {
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
    
        if (error) {
            console.error('Error signing in:', error.message);
        } else {
            console.log('Session:', session); // Contains access_token
            return session.access_token;
        }
    };

    const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return false;
        }
        return true;
    };

    const getLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) return;
    
        let location = await Location.getCurrentPositionAsync({});
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    };

    const sendLocationToBackend = async (latitude, longitude, accessToken) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Driver Locations`, {
            method: 'POST',
            headers: {
                'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude,
                longitude,
                timestamp: new Date().toISOString(),
                driver_id: 1,  // Genarate this!
            }),
        });
    
        if (!response.ok) {
            console.error('Failed to send location:', response.statusText);
        } else {
            console.log('Location sent successfully');
        }
    };

    const handleSendLocation = async () => {
        const accessToken = await signIn('user@example.com', 'yourpassword');

        if (accessToken) {
            setInterval(async () => {
                const location = await getLocation();
                if (location && isRideStarted) {
                    await sendLocationToBackend(location.latitude, location.longitude, accessToken);
                }
            }, 5000); // Send every 5 seconds
        }
    };
    

    function startRide() {
        console.log('Starting Ride');
        isRideStarted = true;
        console.log(handleSendLocation());
        // Alert.alert('Are you sure?', 'Do you want to start the ride?', [{ text: 'Yes'}, { text: 'No' }]);
        // alert('Starting Ride');
    }

    function endRide() {
        if (isRideStarted) {
            Alert.alert('Are you sure?', 'Do you want to end the ride?', [{ text: 'Yes', onPress: () => {console.log('Ride Ended'); isRideStarted = false;} }, { text: 'No' }]);
            console.log('Ending Ride');
        }
        // alert('Ending Ride');
    }

  return (
    <SafeAreaView style={styles.container}>
      <Text>CEYLON PUBLIC TRANSIT</Text>
      <Pressable style={styles.cta} onPress={startRide}>
        <Text style={{ color: 'white' }}>Start Ride</Text>
      </Pressable>
      <Pressable style={styles.ctaEND} onPress={endRide}>
        <Text style={{ color: 'white' }}>End Ride</Text>
      </Pressable>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    marginTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
    ctaEND: {
        marginTop: 36,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#FF4D4D',
    },
});
