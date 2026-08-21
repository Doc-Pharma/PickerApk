import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, StatusBar, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { TopBar, LocationCard, ScanArea, ErrorBanner } from '../../components';

import Colors from '../../theme/colors';
import * as paApi from '../../api/putaway';
import useApi from '../../hooks/useApi';
import Toast from '../../utils/toast';

import Routes from '../../navigation/routes';

const parseChips = location => {
  const parts = (location || '').split('-');

  if (parts.length < 4) {
    return [location || '-'];
  }

  return [
    `Aisle ${parts[0]}`,
    `Rack ${parts[1].replace('R', '')}`,
    `Shelf ${parts[2].replace('S', '')}`,
    `Bin ${parts[3].replace('B', '')}`,
  ];
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
    if (scanStatus === 'ok' || loading) {
      return;
    }

    setScanActive(false);
    let locationName = '';

    try {
      const parsed = JSON.parse(code);

      locationName = parsed?.name || '';
    } catch {}

    if (!locationName) {
      const message = 'Invalid location QR. Please scan the bin QR code.';

      setScanStatus('error');
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

      if (response?.success === false) {
        throw new Error(
          response?.message ||
            response?.error ||
            'Scanned Location is not correct.',
        );
      }

      setScanStatus('ok');
      setErrorMsg('');

      Toast.success('This Putaway has been verified.');

      setTimeout(() => {
        navigation.navigate(Routes.HOME);
      }, 700);
    } catch (error) {
      const message =
        error?.message === 'Request failed with status code 400'
          ? 'Scanned Location is not correct.'
          : error?.message || 'Unable to verify putaway. Please try again.';

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
    fontSize: 20,
    fontWeight: '700',
    color: Colors.navy,
    textAlign: 'center',
  },

  successContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },

  successText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.navy,
    textAlign: 'center',
  },

  bottomSpace: {
    height: 40,
  },
});
