import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import MainNavigator from './src/navigation/MainNavigator';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from './src/theme/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'PlayfairDisplay-SemiBold': { uri: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvL-7_Wve9LH0VqHhL10U6XvKByfQ9OHS1776Xf7_E.ttf' },
          'Cinzel-Regular': { uri: 'https://fonts.gstatic.com/s/cinzel/v23/8vLx7ww0ndv0o0n8_W1G9Xn0.ttf' },
          'Montserrat-Regular': { uri: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4v32VGlZtXKrIs.ttf' },
          'Montserrat-Bold': { uri: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4v32VGlZtXKrIs.ttf' }, // Simplified for trial
          'Montserrat-Light': { uri: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4v32VGlZtXKrIs.ttf' },
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bgDark, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={COLORS.accentGold} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <MainNavigator />
            <StatusBar style="light" />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
