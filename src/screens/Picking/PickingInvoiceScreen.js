import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { TopBar, Button } from '../../components';
import { CheckIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import Toast from '../../utils/toast';

const PickingInvoiceScreen = ({ navigation, route }) => {
  const { orderId, invoice } = route?.params || {};
  const scale = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
    }, []),
  );

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 7,
    }).start();
  }, []);

  const invoiceId = invoice?.order_number || invoice?.id || invoice?.invoice_id;
  const displayId = orderId;
  const skuCount = invoice?.skus ?? invoice?.totalSkus ?? invoice?.sku_count;
  const orderType =
    invoice?.orderType || invoice?.order_service_type || invoice?.order_type;

  const handleHandover = () => {
    Toast.success('Order handed over to rider!');
    navigation.navigate(Routes.PICKING_COMPLETE, { orderId, invoice });
  };

  return (
    <View style={s.safe}>
      {/* No back button — matches HTML which has no back on this screen */}
      <TopBar title="Invoice Generated" />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated success icon — matches .si.pk */}
        <Animated.View style={[s.iconCircle, { transform: [{ scale }] }]}>
          <CheckIcon color={Colors.pk} size={36} />
        </Animated.View>

        <Text style={s.title}>All Items Picked</Text>
        <Text style={s.subtitle}>
          Invoice {invoiceId} generated in WMS. Print and attach to package.
        </Text>

        {/* Summary card — matches .s-card.pk */}
        <View style={s.summaryCard}>
          {[
            { k: 'Order ID', v: displayId },
            { k: 'Invoice', v: invoiceId },
            { k: 'SKUs', v: skuCount },
            { k: 'Order Type', v: orderType },
          ].map((row, i) => (
            <View key={i} style={s.summaryRow}>
              <Text style={s.summaryKey}>{row.k}</Text>
              <Text style={s.summaryVal}>{row.v}</Text>
            </View>
          ))}
        </View>

        {/* Next steps */}
        <View style={s.nextBox}>
          <Text style={s.nextTitle}>Next Steps</Text>
          <Text style={s.nextText}>
            {
              '1. Go to WMS → print invoice\n2. Pack all items\n3. Attach invoice to package\n4. Hand over to delivery rider'
            }
          </Text>
        </View>

        <Button
          title="Mark as Handed Over →"
          variant="green"
          onPress={handleHandover}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </View>
  );
};

export default PickingInvoiceScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, alignItems: 'center', padding: 28, paddingTop: 24 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.pkLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.g900,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.g500,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: Colors.pkLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(192,86,33,0.15)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryKey: { fontSize: 12, fontWeight: '600', color: Colors.pk },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.g900,
    fontFamily: 'monospace',
  },
  nextBox: {
    width: '100%',
    backgroundColor: Colors.pkLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(192,86,33,0.15)',
    marginBottom: 18,
    alignSelf: 'stretch',
  },
  nextTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.pk,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  nextText: { fontSize: 14, color: Colors.pkDark, lineHeight: 28 },
});
