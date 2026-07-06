// src/hooks/useCameraPermission.js
// Camera permission state machine for Android + iOS
// Uses react-native-vision-camera's permission API.

import { useState, useEffect, useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import { Camera } from 'react-native-vision-camera';

// status: 'unknown' | 'requesting' | 'granted' | 'denied' | 'blocked'

const useCameraPermission = () => {
  const [status, setStatus] = useState('unknown');
  const [requesting, setRequesting] = useState(false);

  // Check on mount
  useEffect(() => {
    check();
  }, []);

  const check = useCallback(async () => {
    try {
      const current = await Camera.getCameraPermissionStatus();
      if (current === 'granted') setStatus('granted');
      else if (current === 'not-determined') setStatus('unknown');
      else setStatus('blocked'); // denied / restricted
    } catch {
      setStatus('unknown');
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setRequesting(true);
    setStatus('requesting');
    try {
      const result = await Camera.requestCameraPermission();
      if (result === 'granted') {
        setStatus('granted');
        return 'granted';
      } else if (result === 'denied') {
        setStatus('denied');
        return 'denied';
      } else {
        setStatus('blocked');
        return 'blocked';
      }
    } catch {
      setStatus('unknown');
      return 'unknown';
    } finally {
      setRequesting(false);
    }
  }, []);

  const openSettings = useCallback(() => {
    if (Platform.OS === 'ios') Linking.openURL('app-settings:');
    else Linking.openSettings();
  }, []);

  return {
    hasPermission: status === 'granted',
    status,
    requesting,
    requestPermission,
    openSettings,
    recheckPermission: check,
  };
};

export default useCameraPermission;
