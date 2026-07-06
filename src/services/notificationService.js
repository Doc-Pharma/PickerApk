import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import crashlytics from '@react-native-firebase/crashlytics';

const CHANNEL_ID = 'picker_tasks';

/**
 * Request permission, create the notifee channel, get + watch FCM token.
 * Call this once after the user is authenticated.
 * @param {(token: string) => void} onToken - called immediately and on token refresh
 * @returns cleanup function
 */
export async function initNotifications(onToken) {
  try {
    const authStatus = await messaging().requestPermission();
    const granted =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!granted) return () => {};

    try {
      const token = await messaging().getToken();
      await onToken(token);
    } catch (tokenError) {
      crashlytics().recordError(tokenError);
    }

    const unsubToken = messaging().onTokenRefresh(async newToken => {
      try {
        await onToken(newToken);
      } catch (refreshError) {
        crashlytics().recordError(refreshError);
      }
    });

    const unsubMessage = messaging().onMessage(async remoteMessage => {
      try {
        await showLocalNotification(remoteMessage);
      } catch (msgError) {
        crashlytics().recordError(msgError);
      }
    });

    return () => {
      try {
        unsubToken();
        unsubMessage();
      } catch (_) {}
    };
  } catch (error) {
    crashlytics().recordError(error);
    return () => {};
  }
}

/**
 * Wire up navigation when user taps a notification.
 * @param {object} navigationRef - React Navigation ref
 * @returns cleanup function
 */
export function setupNotificationNavigation(navigationRef) {
  let unsubBg = () => {};
  let unsubFg = () => {};

  try {
    unsubBg = messaging().onNotificationOpenedApp(msg => {
      try {
        navigateFromMessage(msg?.data, navigationRef);
      } catch (error) {
        crashlytics().recordError(error);
      }
    });
  } catch (error) {
    crashlytics().recordError(error);
  }

  messaging()
    .getInitialNotification()
    .then(msg => {
      if (msg) navigateFromMessage(msg?.data, navigationRef);
    })
    .catch(error => {
      crashlytics().recordError(error);
    });

  try {
    unsubFg = notifee.onForegroundEvent(({ type, detail }) => {
      try {
        if (type === EventType.PRESS) {
          navigateFromMessage(detail?.notification?.data, navigationRef);
        }
      } catch (error) {
        crashlytics().recordError(error);
      }
    });
  } catch (error) {
    crashlytics().recordError(error);
  }

  return () => {
    try {
      unsubBg();
      unsubFg();
    } catch (_) {}
  };
}

async function showLocalNotification(remoteMessage) {
  const { notification, data } = remoteMessage;
  if (!notification) return;
  await notifee.displayNotification({
    title: notification.title,
    body: notification.body,
    android: {
      channelId: CHANNEL_ID,
      importance: AndroidImportance.HIGH,
      pressAction: { id: 'default' },
    },
    data,
  });
}

function navigateFromMessage(data, navigationRef) {
  if (!navigationRef?.current || !data?.type) return;

  try {
    switch (data.type) {
      case 'pickup_task':
        // navigationRef.current.navigate('PickingScreen', { taskId: data.task_id });
        break;
      default:
        break;
    }
  } catch (error) {
    crashlytics().recordError(error);
  }
}
