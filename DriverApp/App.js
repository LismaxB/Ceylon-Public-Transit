import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Alert, Pressable } from 'react-native';

import * as Location from 'expo-location';

export default function App() {
    console.log('Starting Application');

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

    let isRideStarted = false;

    function startRide() {
        console.log('Starting Ride');
        isRideStarted = true;
        console.log(getLocation());
        // Alert.alert('Are you sure?', 'Do you want to start the ride?', [{ text: 'Yes'}, { text: 'No' }]);
        // alert('Starting Ride');
    }

    function endRide() {
        if (isRideStarted) {
            Alert.alert('Are you sure?', 'Do you want to end the ride?', [{ text: 'Yes', onPress: () => {console.log('Ending Ride'); isRideStarted = false;} }, { text: 'No' }]);
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
