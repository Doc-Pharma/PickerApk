import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { TopBar, StepBar, ProductDetailCard, Button } from '../../components';
import { CheckIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import * as pickingApi from '../../api/picking';
import Toast from '../../utils/toast';

const PickingConfirmItemScreen = ({ navigation, route }) => {
  const {
    orderId,
    item,
    batch,
    scanIndex = 1,
    qtyRequired = 1,
    manualEntry,
  } = route?.params || {};

  const productName = item?.name;
  const dpId = item?.dp_id || batch?.dpId || batch?.dp_id || '';
  const batchNo = batch?.batch_no || batch?.batch_number || batch?.id || '';
  const expiry = batch?.expiry || batch?.expiry_date || '';
  const expiryRaw = batch?.exp_date || batch?.expiry_date || expiry || '';
  const mrp = batch?.mrp || item?.mrp || '';
  const partnerId = batch?.partner_id || '';
  const uniqueId = batch?.unique_id || '';

  const isLastUnit = scanIndex >= qtyRequired;

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
    }, []),
  );

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await pickingApi.markItemPickedUp(item?.id, {
        dp_id: dpId,
        batch_number: batchNo,
        mrp: String(mrp),
        expiry_date: expiryRaw,
        quantity: 1,
        location_id: item?.location_id || '',
        partner_id: partnerId,
        unique_id: uniqueId,
      });

      if (isLastUnit) {
        Toast.success(`${productName} fully picked!`);
        navigation.navigate(Routes.PICKING_REVIEW, { orderId });
      } else {
        Toast.success(`Unit ${scanIndex} of ${qtyRequired} confirmed`);
        // Navigate back to scan screen — React Navigation pops confirm and updates ScanProduct params
        navigation.navigate(Routes.PICKING_SCAN_PRODUCT, {
          orderId,
          item,
          scanIndex: scanIndex + 1,
        });
      }
    } catch (err) {
      Toast.error(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.safe}>
      <TopBar title="Confirm Pick" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <StepBar
          current={2}
          total={2}
          label="Verify & confirm the item"
          accentColor="picking"
        />

        {qtyRequired > 1 && (
          <View style={s.progressRow}>
            <View style={s.progressBarTrack}>
              <View
                style={[s.progressBarFill, { flex: scanIndex / qtyRequired }]}
              />
              <View style={{ flex: (qtyRequired - scanIndex) / qtyRequired }} />
            </View>
            <Text style={s.progressLabel}>
              Unit {scanIndex} of {qtyRequired}
            </Text>
          </View>
        )}

        <View style={s.productCard}>
          <View style={s.imgBox}>
            <Text style={s.imgEmoji}>💊</Text>
          </View>
          <View style={s.productText}>
            <Text style={s.productName} numberOfLines={2}>
              {productName}
            </Text>
            <View style={s.verifiedRow}>
              <CheckIcon color={Colors.green} size={13} />
              <Text style={s.verifiedLabel}>Product verified</Text>
            </View>
          </View>
        </View>

        <ProductDetailCard
          rows={[
            { label: 'DP-ID', value: dpId || '—' },
            {
              label: manualEntry ? 'Batch No. (manual)' : 'Batch No. (scanned)',
              value: batchNo || '—',
              valueStyle: { color: Colors.green },
            },
            {
              label: manualEntry ? 'Expiry (manual)' : 'Expiry (scanned)',
              value: expiry || '—',
              valueStyle: { color: Colors.green },
            },
            { label: 'MRP', value: mrp ? `₹${mrp}` : '—' },
          ]}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.footer}>
        <Button
          title={
            isLastUnit
              ? 'Confirm Pick →'
              : `Confirm & Scan Unit ${scanIndex + 1} →`
          }
          variant="picking"
          loading={loading}
          onPress={handleConfirm}
        />
      </View>
    </View>
  );
};

export default PickingConfirmItemScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.g50 },
  progressRow: {
    marginHorizontal: 14,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.g100,
    gap: 8,
  },
  progressBarTrack: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.g100,
    overflow: 'hidden',
  },
  progressBarFill: {
    backgroundColor: Colors.green,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.g700,
  },
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
    backgroundColor: Colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(13,122,78,0.1)',
    flexShrink: 0,
  },
  imgEmoji: { fontSize: 28 },
  productText: { flex: 1, minWidth: 0 },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.g900,
    marginBottom: 6,
  },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  verifiedLabel: { fontSize: 13, color: Colors.green, fontWeight: '600' },
  footer: {
    padding: 14,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.g100,
  },
});
