import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { TopBar, Button } from '../../components';
import { CheckIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import * as pickingApi from '../../api/picking';
import useApi from '../../hooks/useApi';
import Toast from '../../utils/toast';
import ApiErrorCode from '../../constants/errorCodes';

const PickingReviewScreen = ({ navigation, route }) => {
  const { orderId } = route?.params || {};
  const [pickedItems, setPickedItems] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  const { loading, execute: doComplete } = useApi(pickingApi.markTaskComplete);

  useEffect(() => {
    pickingApi
      .getPickingOrder(orderId)
      .then(res => {
        setPickedItems(res?.items || []);
        setOrderData(res?.order || null);
      })
      .catch(() => {})
      .finally(() => setFetchLoading(false));
  }, [orderId]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
    }, []),
  );

  const handleConfirm = async () => {
    try {
      await doComplete(orderId);
      const invoice = {
        order_number: orderData?.order_number,
        id: orderData?.order_number || orderData?.id,
        skus: orderData?.totalSkus,
        orderType: orderData?.order_service_type || orderData?.orderType,
      };
      Toast.success('Task completed!');
      navigation.navigate(Routes.PICKING_INVOICE, { orderId, invoice });
    } catch (err) {
      // toast already shown by useApi - if the order was cancelled in the background
      // while this screen was open, bounce back to Home instead of leaving the picker
      // stuck on a dead task
      if (err?.code === ApiErrorCode.ORDER_CANCELLED) {
        navigation.reset({ index: 0, routes: [{ name: Routes.HOME }] });
      }
    }
  };

  return (
    <View style={s.safe}>
      <TopBar title="Review & Confirm" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* All-picked banner */}
        <View style={s.banner}>
          <CheckIcon color={Colors.pk} size={16} />
          <Text style={s.bannerText}>
            {pickedItems.length} items — review before confirming
          </Text>
        </View>

        {/* Review card */}
        <View style={s.reviewCard}>
          <Text style={s.reviewTitle}>Picked Items Summary</Text>
          {fetchLoading ? (
            <Text style={s.reviewDetail}>Loading…</Text>
          ) : (
            pickedItems.map((row, i) => (
              <View
                key={i}
                style={[
                  s.reviewRow,
                  i === pickedItems.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={s.reviewProd} numberOfLines={1}>
                  {row.name}
                  {'  '}
                  <Text style={s.reviewQty}>×{row.qty}</Text>
                </Text>
                <Text style={s.reviewDetail}>
                  {row.batch_number || row.batch}
                  {row.expiry_date || row.expiry
                    ? ` · ${row.expiry_date || row.expiry}`
                    : ''}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Warning note */}
        <View style={s.warnNote}>
          <Text style={s.warnText}>
            After confirming, an invoice will be auto-generated in WMS. Print it
            from WMS and attach to the packed package.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.footer}>
        <Button
          title="Confirm All Picked"
          variant="picking"
          loading={loading}
          onPress={handleConfirm}
        />
      </View>
    </View>
  );
};

export default PickingReviewScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.g50 },
  banner: {
    marginHorizontal: 14,
    marginTop: 14,
    backgroundColor: Colors.pkLight,
    borderRadius: 12,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderColor: 'rgba(192,86,33,0.15)',
  },
  bannerText: { fontSize: 13, color: Colors.pk, fontWeight: '600', flex: 1 },
  reviewCard: {
    marginHorizontal: 14,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
  },
  reviewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.g500,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 12,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
    gap: 8,
  },
  reviewProd: { fontSize: 13, fontWeight: '600', color: Colors.g900, flex: 1 },
  reviewQty: { color: Colors.g300 },
  reviewDetail: {
    fontSize: 12,
    color: Colors.g500,
    fontFamily: 'monospace',
    textAlign: 'right',
  },
  warnNote: {
    marginHorizontal: 14,
    marginTop: 10,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(180,83,9,0.15)',
  },
  warnText: { fontSize: 13, color: '#92400E', lineHeight: 20 },
  footer: {
    padding: 14,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.g100,
  },
});
