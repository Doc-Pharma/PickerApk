import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  TopBar,
  StepBar,
  LocationCard,
  ScanArea,
  ErrorBanner,
  Button,
  BatchModal,
} from '../../components';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import * as pickingApi from '../../api/picking';
import { formatExpiryDate, parseChips } from '../../utils/helpers';

const PickingScanProductScreen = ({ navigation, route }) => {
  const { orderId, item, allItems, partnerId } = route?.params || {};

  // scanIndex comes back from ConfirmItem when looping (e.g. 2, 3, ...).
  // On a fresh entry (no scanIndex in params), resume from item.picked_quantity
  // so units already confirmed before an app restart aren't re-scanned.
  const scanIndex =
    route?.params?.scanIndex ?? (item?.picked_quantity || 0) + 1;
  const qtyRequired = item?.qty || 1;

  const productName = item?.name;
  const location =
    item?.location || item?.location_name || item?.bin_location || '';
  const chips = parseChips(location);

  const [scanStatus, setScanStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [batchModal, setBatchModal] = useState(false);
  const [scanActive, setScanActive] = useState(true);
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(false);

  useEffect(() => {
    const productId = item?.product_id;
    if (!productId) return;
    setBatchesLoading(true);
    pickingApi
      .getProductBatches(productId, partnerId)
      .then(res => {
        const raw = Array.isArray(res?.data) ? res.data : [];
        setBatches(
          raw.map(b => ({
            ...b,
            id: b.batch_no,
            label: b.batch_no,
            expiry: formatExpiryDate(b.exp_date),
          })),
        );
      })
      .catch(() => {})
      .finally(() => setBatchesLoading(false));
  }, [item?.product_id, partnerId]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
      setScanStatus('idle');
      setErrorMsg('');
      setScanActive(true);
    }, []),
  );

  const parseQR = code => {
    const parts = (code || '').split(',');
    if (parts.length < 5) return null;
    const scannedPartnerId = (parts[0] || '').trim();
    const dpId = (parts[4] || '').trim();
    const batchNo = (parts[2] || '').trim();
    const expRaw = (parts[3] || '').trim();
    const uniqueId = (parts[parts.length - 1] || '').trim();
    return {
      dpId,
      batch_no: batchNo,
      exp_date: expRaw,
      id: batchNo,
      label: batchNo,
      expiry: formatExpiryDate(expRaw),
      partner_id: scannedPartnerId,
      unique_id: uniqueId,
    };
  };

  const goToConfirm = (batch, manualEntry) => {
    navigation.navigate(Routes.PICKING_CONFIRM_ITEM, {
      orderId,
      item,
      batch,
      scanIndex,
      qtyRequired,
      manualEntry,
      allItems,
      partnerId,
    });
  };

  const handleScanned = code => {
    if (scanStatus === 'ok') return;
    const parsed = parseQR(code);
    if (!parsed?.dpId) {
      setScanStatus('error');
      setErrorMsg('Invalid QR code. Please scan the correct product label.');
      setScanActive(true);
      return;
    }
    setScanStatus('ok');
    setTimeout(() => {
      goToConfirm({ ...parsed, dp_id: parsed.dpId }, false);
    }, 700);
  };

  const handleBatchConfirm = batch => {
    setBatchModal(false);
    setTimeout(() => goToConfirm(batch, true), 300);
  };

  const scanHint =
    qtyRequired > 1
      ? `Scan unit ${scanIndex} of ${qtyRequired}`
      : 'Scan the QR label on the product';

  return (
    <View style={s.safe}>
      <TopBar title="Scan Product" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <StepBar
          current={1}
          total={2}
          label="Navigate, pick & scan product"
          accentColor="picking"
        />

        <LocationCard
          label="Go to this location"
          location={location}
          chips={chips}
          accentColor="picking"
        />

        <View style={s.productCard}>
          <View style={s.imgBox}>
            <Text style={s.imgEmoji}>💊</Text>
          </View>
          <View style={s.productText}>
            <Text style={s.productName} numberOfLines={2}>
              {productName}
            </Text>
            {item?.dp_id ? (
              <Text style={s.productMeta}>{item.dp_id}</Text>
            ) : null}
          </View>
          {qtyRequired > 1 && (
            <View style={s.qtyBadge}>
              <Text style={s.qtyBadgeCount}>
                {scanIndex}/{qtyRequired}
              </Text>
              <Text style={s.qtyBadgeLabel}>units</Text>
            </View>
          )}
        </View>

        <ScanArea
          status={scanStatus}
          hint={scanHint}
          accentColor="picking"
          onScanned={handleScanned}
          active={scanActive}
        />

        <ErrorBanner visible={scanStatus === 'error'} message={errorMsg} />

        <View style={{ height: 130 }} />
      </ScrollView>

      <View style={s.footer}>
        <Button
          title="Can't scan — enter manually"
          variant="ghost"
          onPress={() => setBatchModal(true)}
        />
      </View>

      <BatchModal
        visible={batchModal}
        batches={batches}
        loading={batchesLoading}
        onConfirm={handleBatchConfirm}
        onClose={() => setBatchModal(false)}
      />
    </View>
  );
};

export default PickingScanProductScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.g50 },
  productCard: {
    marginHorizontal: 14,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  imgBox: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: Colors.pkLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(192,86,33,0.1)',
    flexShrink: 0,
  },
  imgEmoji: { fontSize: 28 },
  productText: { flex: 1, minWidth: 0 },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.g900,
    marginBottom: 5,
  },
  productMeta: { fontSize: 13, color: Colors.g500, fontFamily: 'monospace' },
  qtyBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: Colors.pkLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(192,86,33,0.2)',
  },
  qtyBadgeCount: { fontSize: 16, fontWeight: '800', color: Colors.pk },
  qtyBadgeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.pkDark,
    marginTop: 1,
  },
  footer: {
    padding: 14,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.g100,
  },
});
