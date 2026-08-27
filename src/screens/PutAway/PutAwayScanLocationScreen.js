// src/screens/PutAway/PutAwayScanLocationScreen.js
import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  TopBar,
  StepBar,
  LocationCard,
  ScanArea,
  ErrorBanner,
} from '../../components';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import * as paApi from '../../api/putaway';
import useApi from '../../hooks/useApi';
import Toast from '../../utils/toast';
import { parseChips } from '../../utils/helpers';

const scanMsg = (err, expectedLocation) => {
  const raw = (err?.message || '').toLowerCase();
  if (raw.includes('404') || raw.includes('not found'))
    return `Location not found. Please scan the bin QR code at "${expectedLocation}".`;
  if (
    raw.includes('wrong') ||
    raw.includes('mismatch') ||
    raw.includes('incorrect')
  )
    return `Wrong location scanned. Navigate to "${expectedLocation}" and scan that bin's QR code.`;
  if (raw && !raw.includes('request failed') && !raw.includes('network'))
    return err.message;
  return `Scan failed. Try again.`;
};

const PutAwayScanLocationScreen = ({ navigation, route }) => {
  const { taskId, product, qty } = route?.params || {};
  const location = product?.destination || '';
  const chips = parseChips(location);

  const [scanStatus, setScanStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [scanActive, setScanActive] = useState(true);

  const { loading, execute: doScanLoc } = useApi(paApi.scanPutAwayLocation, {
    suppressToast: true,
  });

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
      setScanStatus('idle');
      setErrorMsg('');
      setScanActive(true);
    }, []),
  );

  const handleScanned = async code => {
    if (scanStatus === 'ok' || loading) return;
    setScanActive(false);

    // Location QR is JSON e.g. {"id":5,"name":"A-R03-S02-B02"}
    let locationId = null;
    let locationName = '';
    try {
      const parsed = JSON.parse(code);
      locationId = parsed?.id;
      locationName = parsed?.name || '';
    } catch {
      locationId = null;
    }

    if (!locationId) {
      setScanStatus('error');
      const msg = 'Invalid location QR. Please scan the bin QR code.';
      setErrorMsg(msg);
      Toast.error(msg);
      setScanActive(true);
      return;
    }

    try {
      const res = await doScanLoc(product?.id, locationId);
      if (res?.success !== false) {
        setScanStatus('ok');
        setErrorMsg('');
        Toast.success('Location confirmed!');
        setTimeout(() => {
          navigation.navigate(Routes.PUT_AWAY_PLACED, {
            taskId,
            product,
            qty,
            location: locationName || location,
            allDone: res?.all_done ?? res?.allDone ?? false,
          });
        }, 700);
      } else {
        const raw = res?.message || res?.error || '';
        const msg = scanMsg({ message: raw }, location);
        setScanStatus('error');
        setErrorMsg(msg);
        Toast.error(msg);
        setScanActive(true);
      }
    } catch (err) {
      const msg = scanMsg(err, location);
      setScanStatus('error');
      setErrorMsg(msg);
      Toast.error(msg);
      setScanActive(true);
    }
  };

  return (
    <View style={s.safe}>
      <TopBar title="Scan Location" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <StepBar
          current={3}
          total={3}
          label="Confirm bin placement"
          accentColor="blue"
        />

        <LocationCard
          label="Navigate to this location"
          location={location}
          chips={chips}
          accentColor="blue"
        />

        <ScanArea
          status={scanStatus}
          hint="Scan the QR code on the bin"
          accentColor="blue"
          onScanned={handleScanned}
          active={scanActive}
        />

        <ErrorBanner visible={scanStatus === 'error'} message={errorMsg} />

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

export default PutAwayScanLocationScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.g50 },
});
