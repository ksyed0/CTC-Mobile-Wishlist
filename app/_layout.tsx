import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../contexts/AuthContext';
import { ProductProvider } from '../contexts/ProductContext';
import { WishlistProvider } from '../contexts/WishlistContext';
import { colors } from '../theme/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <ProductProvider>
        <WishlistProvider>
          <StatusBar style="light" backgroundColor={colors.primary} />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="product/[id]"
              options={{
                title: 'Product Details',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="wishlist/[id]"
              options={{
                title: 'Wishlist',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="wishlist/shared/[id]"
              options={{
                title: 'Shared Wishlist',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                title: 'Sign In',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
                headerBackVisible: false,
              }}
            />
          </Stack>
        </WishlistProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
