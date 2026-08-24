import React, { useCallback, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Routes from '../../navigation/routes';
import { TopBar, ScanArea, ErrorBanner } from '../../components';

import Colors from '../../theme/colors';
import * as paApi from '../../api/putaway';
import Toast from '../../utils/toast';

const ProductQrScanScreen = ({ navigation }) => {
  const [scanStatus, setScanStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [scanActive, setScanActive] = useState(true);

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
    if (scanStatus === 'ok') return;

    setScanActive(false);

    try {
      // Validate location QR before product QR parsing
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

      const res = await paApi.scanProductQR(qrData);

      setScanStatus('ok');
      Toast.success('Product QR scanned successfully');

      navigation.navigate(Routes.PRODUCT_DETAILS, {
        productData: res.product,
      });
    } catch (error) {
      const message =
        error?.message === 'Request failed with status code 400'
          ? 'Invalid Product QR. Please scan the correct product label.'
          : error?.message || 'Product QR API failed';

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
          active={scanActive}
        />

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
  messageContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.navy,
    textAlign: 'center',
  },
  bottomSpace: {
    height: 40,
  },
});
