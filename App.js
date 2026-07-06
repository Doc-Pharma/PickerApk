import React, { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import { DimensionsProvider } from './src/context/DimensionsProvider';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider, useUser } from './src/context/UserContext';
import CrashlyticsErrorBoundary from './src/components/CrashlyticsErrorBoundary';
import {
  initNotifications,
  setupNotificationNavigation,
} from './src/services/notificationService';
import { registerFcmToken } from './src/api/device';
import { SocketProvider } from './src/context/SocketContext';

const AppContent = () => {
  const { auth } = useUser();
  const navigationRef = useRef(null);

  useEffect(() => {
    const tagUser = async () => {
      try {
        if (auth?.user?.id) {
          const userId = String(auth.user.id);
          try {
            await crashlytics().setUserId(userId);
          } catch (_) {}
          try {
            await analytics().setUserId(userId);
          } catch (_) {}
          try {
            const [model, build] = await Promise.all([
              DeviceInfo.getModel(),
              DeviceInfo.getBuildNumber(),
            ]);
            await crashlytics().setAttributes({
              deviceModel: model,
              appVersion: DeviceInfo.getVersion(),
              buildNumber: build,
              osVersion: DeviceInfo.getSystemVersion(),
            });
          } catch (_) {}
        } else {
          try {
            await crashlytics().setUserId('');
            await analytics().setUserId(null);
          } catch (_) {}
        }
      } catch (_) {}
    };
    tagUser();
  }, [auth?.user?.id]);

  useEffect(() => {
    if (!auth?.token) return;

    let notifCleanup = () => {};
    let navCleanup = () => {};

    const bootstrap = async () => {
      try {
        notifCleanup = await initNotifications(async token => {
          try {
            await registerFcmToken(token);
          } catch (_) {}
        });
      } catch (_) {}
      try {
        navCleanup = setupNotificationNavigation(navigationRef);
      } catch (_) {}
    };

    bootstrap();

    return () => {
      try {
        notifCleanup();
      } catch (_) {}
      try {
        navCleanup();
      } catch (_) {}
    };
  }, [auth?.token]);

  return (
    <>
      <AppNavigator navigationRef={navigationRef} />
      <Toast />
    </>
  );
};

const App = () => {
  return (
    <CrashlyticsErrorBoundary>
      <SafeAreaProvider>
        <DimensionsProvider>
          <UserProvider>
            <SocketProvider>
              <AppContent />
            </SocketProvider>
          </UserProvider>
        </DimensionsProvider>
      </SafeAreaProvider>
    </CrashlyticsErrorBoundary>
  );
};

export default App;
