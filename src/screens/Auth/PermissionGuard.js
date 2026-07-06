import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { requestCameraPermission } from '../../permissions/camera';
import { requestNotificationPermission } from '../../permissions/notifications';
import PermissionScreen from './PermissionScreen';
import Colors from '../../theme/colors';

// Shown while permissions are being checked — mirrors the splash visuals
// so there is no white flash between SplashScreen and PermissionScreen.
function CheckingView() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.splash, { paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.logoWrap}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <ActivityIndicator
        color={Colors.blue}
        size="small"
        style={styles.spinner}
      />
    </View>
  );
}

export default function PermissionGuard({ children }) {
  const [checking, setChecking] = useState(true);
  const [allGranted, setAllGranted] = useState(false);
  const [states, setStates] = useState({ camera: false, notification: false });

  const appState = useRef(AppState.currentState);

  const check = async (shouldRequest = true) => {
    try {
      const camera = await requestCameraPermission(shouldRequest);
      const notification = await requestNotificationPermission(shouldRequest);
      setStates({ camera, notification });
      setAllGranted(camera && notification);
    } catch {
      setAllGranted(false);
    } finally {
      setChecking(false);
    }
  };

  // On mount: request permissions
  useEffect(() => {
    check(true);
  }, []);

  // When app returns to foreground: check-only (no dialog)
  useEffect(() => {
    const sub = AppState.addEventListener('change', next => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        check(false);
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  if (checking) {
    return <CheckingView />;
  }

  if (!allGranted) {
    return (
      <PermissionScreen
        isCameraGranted={states.camera}
        isNotificationGranted={states.notification}
        onRetry={() => check(true)}
      />
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 250,
    height: 250,
  },
  spinner: {
    marginBottom: 20,
  },
});
