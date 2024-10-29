import React, { useEffect } from 'react'
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

import "../global.css";

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Thin': require('../assets/fonts/Poppins-Thin.ttf'),
  });

  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded)SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if(!fontsLoaded && !error) return null;

  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown:false}}/>
    </Stack>
  );
}

export default RootLayout;