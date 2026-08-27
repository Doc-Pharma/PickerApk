import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Routes from '../../navigation/routes';
import { TopBar, ScanArea, ErrorBanner } from '../../components';

import Colors from '../../theme/colors';
import * as paApi from '../../api/putaway';
import useApi from '../../hooks/useApi';
import Toast from '../../utils/toast';

const scanMsg = err => {
  const raw = (err?.message || '').toLowerCase();

  if (raw.includes('404') || raw.includes('not found')) {
    return 'Product not found. Please scan the correct product QR label.';
  }

  if (
    raw.includes('wrong') ||
    raw.includes('mismatch') ||
    raw.includes('incorrect') ||
    raw.includes('invalid')
  ) {
    return 'Invalid Product QR. Please scan the correct product label.';
  }

  if (raw && !raw.includes('request failed') && !raw.includes('network')) {
    return err.message;
  }

  return 'Scan failed. Try again.';
};

const ProductQrScanScreen = ({ navigation }) => {
  const [scanStatus, setScanStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [scanActive, setScanActive] = useState(true);

  const { loading, execute: scanProduct } = useApi(paApi.scanProductQR, {
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

    // Validate location QR before product QR parsing
    try {
      try {
        const parsed = JSON.parse(code);

        if (parsed?.id && parsed?.name) {
          const message =
            'Invalid Product QR. Please scan the product QR label.';

          setScanStatus('error');
          setErrorMsg(message);
          Toast.error(message);
          setScanActive(true);
          return;
        }
      } catch {}

      const qrData = paApi.parsePutAwayQR(code);

      if (
        !qrData.productId ||
        !qrData.partnerId ||
        !qrData.batchNumber ||
        !qrData.dpId
      ) {
        const message = 'Invalid Product QR. Please scan the product QR label.';

        setScanStatus('error');
        setErrorMsg(message);
        Toast.error(message);
        setScanActive(true);
        return;
      }

      const res = await scanProduct(qrData);

      setScanStatus('ok');
      setErrorMsg('');

      Toast.success('Product QR scanned successfully');

      navigation.navigate(Routes.PRODUCT_DETAILS, {
        productData: res.data,
      });
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
      <TopBar title="Scan Product QR" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScanArea
          status={scanStatus}
          hint="Point camera at the QR label on the product"
          accentColor="blue"
          onScanned={handleScanned}
          active={scanActive && !loading}
        />

        {loading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={Colors.blue} />
            <Text style={styles.loadingText}>Verifying product…</Text>
          </View>
        )}

        <ErrorBanner visible={scanStatus === 'error'} message={errorMsg} />

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

export default ProductQrScanScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.g50,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.g500,
  },
  bottomSpace: {
    height: 40,
  },
});
