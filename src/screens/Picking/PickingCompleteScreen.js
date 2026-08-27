import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  BackHandler,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Button } from '../../components';
import { CheckIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import { ENV } from '../../config/env';

const PickingCompleteScreen = ({ navigation, route }) => {
  const { orderId, invoice } = route?.params || {};
  const scale = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor(Colors.navy);
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, []),
  );

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 55,
      friction: 7,
    }).start();
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
  const displayId = orderId;
  const invoiceId = invoice?.id || invoice?.invoice_id;
  const fhOrderId = invoice?.order_number;

  const qrValue = `${ENV.ONE_APP_URL}/home?fh_order_id=${fhOrderId}`;

  const goHome = () =>
    navigation.reset({ index: 0, routes: [{ name: Routes.HOME }] });

  return (
    <ScrollView
      style={s.safe}
      contentContainerStyle={s.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Animated checkmark */}
      <Animated.View style={[s.iconRing, { transform: [{ scale }] }]}>
        <CheckIcon color={Colors.green} size={38} />
      </Animated.View>

      <Text style={s.title}>Order Dispatched</Text>
      <Text style={s.subtitle}>
        {displayId} packed and handed to the delivery rider.
      </Text>

      {/* Stats grid */}
      <View style={s.grid}>
        {[
          {
            value: invoice?.skus ?? invoice?.sku_count ?? '—',
            label: 'SKUs Picked',
          },
          {
            value: invoice?.orderType ?? invoice?.order_type ?? '—',
            label: 'Order Type',
          },
          { value: dateStr, label: 'Date' },
          { value: timeStr, label: 'Dispatched' },
        ].map((item, i) => (
          <View key={i} style={s.statBox}>
            <Text style={s.statVal}>{item.value}</Text>
            <Text style={s.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* QR code card */}
      <View style={s.qrCard}>
        <Text style={s.qrTitle}>Invoice QR</Text>
        <Text style={s.qrSub}>Scan to confirm handover</Text>
        <View style={s.qrBox}>
          <QRCode
            value={qrValue}
            size={150}
            color={Colors.qrFg}
            backgroundColor={Colors.qrBg}
            quietZone={20}
          />
        </View>
        <Text style={s.qrId}>Order #{fhOrderId}</Text>
      </View>

      <Button
        title="Back to Home"
        variant="white"
        onPress={goHome}
        style={{ width: '100%' }}
      />
    </ScrollView>
  );
};

export default PickingCompleteScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.navy },
  scroll: { flexGrow: 1, alignItems: 'center', padding: 28, paddingTop: 40 },
  iconRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(13,122,78,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(13,122,78,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },

  qrCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  qrTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  qrSub: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 18 },
  qrBox: {
    padding: 6,
    backgroundColor: Colors.qrBg,
    borderRadius: 12,
    marginBottom: 12,
  },
  qrId: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    fontFamily: 'monospace',
  },
});
