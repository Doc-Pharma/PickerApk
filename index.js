/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';

// Called when FCM message arrives while app is killed or in background
messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    const { notification, data } = remoteMessage;
    if (!notification) return;

    await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      android: {
        channelId: 'picker_tasks',
        pressAction: { id: 'default' },
      },
      data,
    });
  } catch (_) {}
});

// Called when user interacts with a notifee notification while app is in background
notifee.onBackgroundEvent(async ({ type, detail }) => {
  try {
    if (type === EventType.PRESS) {
      // Navigation handled in App.js via getInitialNotification / onNotificationOpenedApp
    }
  } catch (_) {}
});

AppRegistry.registerComponent(appName, () => App);
