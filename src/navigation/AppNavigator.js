import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { NavigationContainer as NavContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';

import Routes from './routes';
import { useUser } from '../context/UserContext';
import { checkAppVersion } from '../api/app';

// Auth
import SplashScreen from '../screens/Auth/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import OTPScreen from '../screens/Auth/OTPScreen';
import PermissionGuard from '../screens/Auth/PermissionGuard';

// Update
import UpdateScreen from '../screens/Update/UpdateScreen';

// Main
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import PastOrdersScreen from '../screens/PastOrders/PastOrdersScreen';
import PastOrderDetailScreen from '../screens/PastOrders/PastOrderDetailScreen';

// Put Away
import PutAwayDetailScreen from '../screens/PutAway/PutAwayDetailScreen';
import PutAwayScanProductScreen from '../screens/PutAway/PutAwayScanProductScreen';
import PutAwayQuantityScreen from '../screens/PutAway/PutAwayQuantityScreen';
import PutAwayScanLocationScreen from '../screens/PutAway/PutAwayScanLocationScreen';
import PutAwayPlacedScreen from '../screens/PutAway/PutAwayPlacedScreen';
import PutAwayCompleteScreen from '../screens/PutAway/PutAwayCompleteScreen';

// Picking
import PickingOrderDetailScreen from '../screens/Picking/PickingOrderDetailScreen';
import PickingScanProductScreen from '../screens/Picking/PickingScanProductScreen';
import PickingConfirmItemScreen from '../screens/Picking/PickingConfirmItemScreen';
import PickingReviewScreen from '../screens/Picking/PickingReviewScreen';
import PickingInvoiceScreen from '../screens/Picking/PickingInvoiceScreen';
import PickingCompleteScreen from '../screens/Picking/PickingCompleteScreen';

import Colors from '../theme/colors';

// ─── Simple animated splash shown during the boot check ──────────────────────
const BootSplash = () => {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[boot.root, { paddingBottom: insets.bottom + 24 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={boot.logoWrap}>
        <Animated.Image
          source={require('../assets/logo.png')}
          style={[boot.logo, { opacity, transform: [{ scale }] }]}
          resizeMode="contain"
        />
      </View>
      <ActivityIndicator
        color={Colors.blue}
        size="small"
        style={boot.spinner}
      />
    </View>
  );
};

const boot = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: { width: 250, height: 250 },
  spinner: { marginBottom: 28 },
});

// ─── Navigators ───────────────────────────────────────────────────────────────
const GuestStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const GuestNavigator = () => (
  <NavContainer>
    <GuestStack.Navigator screenOptions={{ headerShown: false }}>
      <GuestStack.Screen name={Routes.SPLASH} component={SplashScreen} />
      <GuestStack.Screen name={Routes.LOGIN} component={LoginScreen} />
      <GuestStack.Screen name={Routes.OTP} component={OTPScreen} />
    </GuestStack.Navigator>
  </NavContainer>
);

const AuthenticatedNavigator = () => (
  <NavContainer>
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name={Routes.HOME} component={HomeScreen} />
      <AuthStack.Screen name={Routes.PROFILE} component={ProfileScreen} />
      <AuthStack.Screen
        name={Routes.PAST_ORDERS}
        component={PastOrdersScreen}
      />
      <AuthStack.Screen
        name={Routes.PAST_ORDER_DETAIL}
        component={PastOrderDetailScreen}
      />

      <AuthStack.Screen
        name={Routes.PUT_AWAY_DETAIL}
        component={PutAwayDetailScreen}
      />
      <AuthStack.Screen
        name={Routes.PUT_AWAY_SCAN_PRODUCT}
        component={PutAwayScanProductScreen}
      />
      <AuthStack.Screen
        name={Routes.PUT_AWAY_QUANTITY}
        component={PutAwayQuantityScreen}
      />
      <AuthStack.Screen
        name={Routes.PUT_AWAY_SCAN_LOCATION}
        component={PutAwayScanLocationScreen}
      />
      <AuthStack.Screen
        name={Routes.PUT_AWAY_PLACED}
        component={PutAwayPlacedScreen}
      />
      <AuthStack.Screen
        name={Routes.PUT_AWAY_COMPLETE}
        component={PutAwayCompleteScreen}
      />

      <AuthStack.Screen
        name={Routes.PICKING_ORDER_DETAIL}
        component={PickingOrderDetailScreen}
      />
      <AuthStack.Screen
        name={Routes.PICKING_SCAN_PRODUCT}
        component={PickingScanProductScreen}
      />
      <AuthStack.Screen
        name={Routes.PICKING_CONFIRM_ITEM}
        component={PickingConfirmItemScreen}
      />
      <AuthStack.Screen
        name={Routes.PICKING_REVIEW}
        component={PickingReviewScreen}
      />
      <AuthStack.Screen
        name={Routes.PICKING_INVOICE}
        component={PickingInvoiceScreen}
      />
      <AuthStack.Screen
        name={Routes.PICKING_COMPLETE}
        component={PickingCompleteScreen}
      />
    </AuthStack.Navigator>
  </NavContainer>
);

// ─── Root navigator ───────────────────────────────────────────────────────────
const AppNavigator = () => {
  const { auth, loading } = useUser();

  const [booting, setBooting] = useState(true);
  const [updateParams, setUpdateParams] = useState(null); // non-null → show update screen

  useEffect(() => {
    if (loading) return; // wait for UserContext to restore auth from storage

    const runBoot = async () => {
      try {
        const res = await checkAppVersion();
        const data = res?.data ?? res; // handles both {data:{...}} and flat response

        if (data?.update_required) {
          setUpdateParams({
            updateInfo: data,
            currentVersion: DeviceInfo.getVersion(),
            currentBuildNo: DeviceInfo.getBuildNumber(),
            forceUpdate: data?.is_force_update ?? false,
          });
        }
      } catch {
        // Version check failed — never block the user
      } finally {
        setBooting(false);
      }
    };

    runBoot();
  }, [loading]);

  // 1. UserContext still loading OR version check in progress
  if (loading || booting) {
    return <BootSplash />;
  }

  // 2. Update required — shown for both logged-in and guest users
  if (updateParams) {
    return (
      <UpdateScreen
        route={{ params: updateParams }}
        onSkip={
          updateParams.forceUpdate ? undefined : () => setUpdateParams(null)
        }
      />
    );
  }

  // 3. Not logged in → guest flow
  if (!auth?.token) {
    return <GuestNavigator />;
  }

  // 4. Logged in → permission gate → home
  return (
    <PermissionGuard>
      <AuthenticatedNavigator />
    </PermissionGuard>
  );
};

export default AppNavigator;
