import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../contexts/AuthContext';
import { ProductProvider } from '../contexts/ProductContext';
import { WishlistProvider } from '../contexts/WishlistContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <ProductProvider>
        <WishlistProvider>
          <StatusBar style="light" backgroundColor="#D52B1E" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="product/[id]"
              options={{
                title: 'Product Details',
                headerStyle: { backgroundColor: '#D52B1E' },
                headerTintColor: '#FFFFFF',
              }}
            />
            <Stack.Screen
              name="wishlist/[id]"
              options={{
                title: 'Wishlist',
                headerStyle: { backgroundColor: '#D52B1E' },
                headerTintColor: '#FFFFFF',
              }}
            />
            <Stack.Screen
              name="wishlist/shared/[id]"
              options={{
                title: 'Shared Wishlist',
                headerStyle: { backgroundColor: '#D52B1E' },
                headerTintColor: '#FFFFFF',
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                title: 'Sign In',
                headerStyle: { backgroundColor: '#D52B1E' },
                headerTintColor: '#FFFFFF',
                headerBackVisible: false,
              }}
            />
          </Stack>
        </WishlistProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
