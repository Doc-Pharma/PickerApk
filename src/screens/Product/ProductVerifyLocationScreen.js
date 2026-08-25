import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, StatusBar, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { TopBar, LocationCard, ScanArea, ErrorBanner } from '../../components';

import Colors from '../../theme/colors';
import * as paApi from '../../api/putaway';
import useApi from '../../hooks/useApi';
import Toast from '../../utils/toast';
import Routes from '../../navigation/routes';
import { parseChips } from '../../utils/helpers';

const scanMsg = err => {
  const raw = (err?.message || '').toLowerCase();

  if (raw.includes('404') || raw.includes('not found')) {
    return 'Location not found. Please scan the bin QR code.';
  }

  if (
    raw.includes('wrong') ||
    raw.includes('mismatch') ||
    raw.includes('incorrect')
  ) {
    return 'Scanned Location is not correct.';
  }

  if (raw && !raw.includes('request failed') && !raw.includes('network')) {
    return err.message;
  }

  return 'Unable to verify putaway. Please try again.';
};

const ProductVerifyLocationScreen = ({ navigation, route }) => {
  const { productId, partnerId, batchNumber, expectedLocation } =
    route?.params || {};

  const [scanStatus, setScanStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [scanActive, setScanActive] = useState(true);

  const { loading, execute: verifyLocation } = useApi(
    paApi.verifyProductPutaway,
    {
      suppressToast: true,
    },
  );

  const chips = parseChips(expectedLocation);

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
    let locationName = '';

    try {
      const parsed = JSON.parse(code);
      locationName = parsed?.name || '';
    } catch {}

    if (!locationName) {
      setScanStatus('error');

      const message = 'Invalid location QR. Please scan the bin QR code.';

      setErrorMsg(message);
      Toast.error(message);
      setScanActive(true);

      return;
    }

    try {
      const response = await verifyLocation(
        productId,
        partnerId,
        batchNumber,
        locationName,
      );

      if (response?.status === false) {
        throw new Error(
          response?.message || 'Scanned Location is not correct.',
        );
      }

      setScanStatus('ok');
      setErrorMsg('');

      Toast.success('This Putaway has been verified.');

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: Routes.HOME }],
        });
      }, 700);
    } catch (err) {
      const message = scanMsg(err);

      setScanStatus('error');
      setErrorMsg(message);
      Toast.error(message);
      setScanActive(true);
    }
  };

  return (
    <View style={styles.safe}>
      <TopBar title="Verify Putaway" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.messageContainer}>
          <Text style={styles.title}>Scan location QR to verify</Text>
        </View>

        <LocationCard
          label="Navigate to this location"
          location={expectedLocation || '-'}
          chips={chips}
          accentColor="blue"
        />

        <ScanArea
          status={scanStatus}
          hint="Scan the QR code on the bin"
          accentColor="blue"
          onScanned={handleScanned}
          active={scanActive && !loading}
        />

        <ErrorBanner visible={scanStatus === 'error'} message={errorMsg} />

        {scanStatus === 'ok' && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              This Putaway has been verified.
            </Text>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

export default ProductVerifyLocationScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.g50,
  },

  container: {
    paddingBottom: 40,
  },

  messageContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.navy,
    textAlign: 'center',
  },

  successContainer: {
    marginHorizontal: 14,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
  },

  successText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.g900,
    textAlign: 'center',
  },

  bottomSpace: {
    height: 40,
  },
});
