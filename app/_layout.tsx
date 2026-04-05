import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '../contexts/AuthContext';
import { ProductProvider } from '../contexts/ProductContext';
import { WishlistProvider } from '../contexts/WishlistContext';
import { colors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

/**
 * Inner component that has access to AuthContext.
 * Redirects to /login when no user is stored on first launch.
 */
function RootNavigator() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';
    const hasUser = currentUser !== null;

    // First launch — no stored user at all → redirect to login
    if (!hasUser && !inAuthGroup) {
      router.replace('/login');
    }
  }, [currentUser, isLoading, segments]);

  return (
    <>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{
            title: 'Product Details',
            headerBackTitle: 'Catalog',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="wishlist/[id]"
          options={{
            title: 'Wishlist',
            headerBackTitle: 'Wishlists',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
          }}
        />
        <Stack.Screen
          name="wishlist/shared/[id]"
          options={{
            title: 'Shared Wishlist',
            headerBackTitle: 'Wishlists',
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
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductProvider>
        <WishlistProvider>
          <RootNavigator />
        </WishlistProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
