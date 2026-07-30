// src/screens/PutAway/PutAwayScanProductScreen.js
import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  TopBar,
  StepBar,
  ScanArea,
  ProductDetailCard,
  Button,
  ScanProductSkeleton,
  ErrorBanner,
} from '../../components';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import * as paApi from '../../api/putaway';
import useApi from '../../hooks/useApi';
import Toast from '../../utils/toast';

const scanMsg = (err, itemName) => {
  const raw = (err?.message || '').toLowerCase();
  if (raw.includes('404') || raw.includes('not found'))
    return `Product not found in this task. Please scan the QR label on "${itemName}".`;
  if (
    raw.includes('wrong') ||
    raw.includes('mismatch') ||
    raw.includes('incorrect')
  )
    return `Wrong product scanned. Please scan the QR label on "${itemName}".`;
  if (raw && !raw.includes('request failed') && !raw.includes('network'))
    return err.message;
  return 'Scan failed. Please try again.';
};

const PutAwayScanProductScreen = ({ navigation, route }) => {
  const { taskId, item, partnerName } = route?.params || {};
  const [scanStatus, setScanStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [scanActive, setScanActive] = useState(true);
  const [product, setProduct] = useState(null);

  const { loading, execute: doScan } = useApi(paApi.scanPutAwayProduct, {
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

    const { dpId, batchNumber, expiryDate, partnerId } =
      paApi.parsePutAwayQR(code);

    if (item?.dp_id && dpId !== item.dp_id) {
      setScanStatus('error');
      setErrorMsg(
        `Wrong product scanned. Please scan the QR label on "${item?.name}".`,
      );
      Toast.error('Wrong product scanned');
      setScanActive(true);
      return;
    }

    if (item?.batch_number && batchNumber !== item.batch_number) {
      setScanStatus('error');
      setErrorMsg(
        `Wrong batch scanned. Please scan the QR label on "${item?.name}".`,
      );
      Toast.error('Wrong batch scanned');
      setScanActive(true);
      return;
    }

    try {
      const res = await doScan(item?.id, dpId, partnerId);
      if (res?.success !== false) {
        setScanStatus('ok');
        const raw = res?.data || res || {};
        const prod = {
          id: item?.id || '',
          name: item?.name || '',
          dpId,
          batch: batchNumber || '',
          expiryDate: expiryDate || '',
          destination: res?.product?.location || raw?.location || '',
          remainingQty: item?.qty ?? 0,
          partner_name: partnerName || '',
        };
        setProduct(prod);
        Toast.success(`${prod.name || dpId} verified!`);
        setTimeout(() => {
          navigation.navigate(Routes.PUT_AWAY_QUANTITY, {
            taskId,
            product: prod,
          });
        }, 700);
      } else {
        const raw = res?.message || res?.error || '';
        const msg = scanMsg({ message: raw }, item?.name);
        setScanStatus('error');
        setErrorMsg(msg);
        Toast.error(msg);
        setScanActive(true);
      }
    } catch (err) {
      const msg = scanMsg(err, item?.name);
      setScanStatus('error');
      setErrorMsg(msg);
      Toast.error(msg);
      setScanActive(true);
    }
  };

  return (
    <View style={s.safe}>
      <TopBar title="Scan Product" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <StepBar
          current={1}
          total={3}
          label="Scan a product QR label"
          accentColor="blue"
        />

        <ScanArea
          status={scanStatus}
          hint="Point camera at the QR label on the product"
          accentColor="blue"
          onScanned={handleScanned}
          active={scanActive}
        />

        <ErrorBanner visible={scanStatus === 'error'} message={errorMsg} />

        {loading ? (
          <ScanProductSkeleton />
        ) : product ? (
          <ProductDetailCard
            name={product.name}
            style={{ marginTop: 14 }}
            rows={[
              { label: 'DP-ID', value: product.dpId },
              { label: 'Batch', value: product.batch },
              { label: 'Expiry', value: product.expiryDate },
              {
                label: 'Destination',
                value: product.destination,
                valueStyle: { color: Colors.blue },
              },
            ]}
          />
        ) : null}

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={s.footer}>
        <Button
          title="QR not readable — Replace with new"
          variant="ghost"
          onPress={() => {}}
          style={s.ghostBtn}
        />
      </View>
    </View>
  );
};

export default PutAwayScanProductScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.g50 },
  footer: {
    padding: 14,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.g100,
    gap: 4,
  },
  ghostBtn: { marginTop: 2 },
});
