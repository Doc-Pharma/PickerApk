import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { BackIcon, CheckIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Toast from '../../utils/toast';
import { getOrderDetail } from '../../api/orders';
import { ENV } from '../../config/env';

const Bone = ({ style }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [anim]);
  return (
    <Animated.View
      style={[
        sk.bone,
        style,
        {
          opacity: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 0.85],
          }),
        },
      ]}
    />
  );
};

const PastOrderDetailSkeleton = () => (
  <ScrollView showsVerticalScrollIndicator={false}>
    {/* Status banner */}
    <View style={sk.banner}>
      <Bone style={sk.bannerCircle} />
      <View style={{ gap: 8 }}>
        <Bone style={{ width: 100, height: 14 }} />
        <Bone style={{ width: 150, height: 11 }} />
      </View>
    </View>
    {/* Info card */}
    <View style={sk.card}>
      {[100, 80, 120, 140, 80].map((w, i) => (
        <View key={i} style={[sk.row, i === 4 && { borderBottomWidth: 0 }]}>
          <Bone style={{ width: w, height: 12 }} />
          <Bone style={{ width: 110, height: 12 }} />
        </View>
      ))}
    </View>
    {/* Items card */}
    <View style={sk.card}>
      <Bone style={{ width: 60, height: 11, marginVertical: 14 }} />
      {[0, 1, 2].map(i => (
        <View key={i} style={[sk.row, i === 2 && { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1, gap: 7 }}>
            <Bone style={{ width: '65%', height: 13 }} />
            <Bone style={{ width: '45%', height: 11 }} />
          </View>
          <Bone style={{ width: 36, height: 26, borderRadius: 6 }} />
        </View>
      ))}
    </View>
  </ScrollView>
);

const formatDate = iso => {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }) +
    ' · ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  );
};

const InfoRow = ({ label, value, last = false }) => (
  <View style={[s.infoRow, last && { borderBottomWidth: 0 }]}>
    <Text style={s.infoLabel}>{label}</Text>
    <Text style={s.infoValue} numberOfLines={1}>
      {value || '---'}
    </Text>
  </View>
);

const PastOrderDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { order: summaryOrder } = route?.params || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getOrderDetail(
        summaryOrder?.task_id ?? summaryOrder?.id,
      );
      setOrder(res?.data);
    } catch (err) {
      Toast.error(err?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [summaryOrder?.id]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
      fetchDetail();
    }, [fetchDetail]),
  );

  const isPicking = (order?.type || summaryOrder?.type) === 'picking';

  if (loading || !order) {
    return (
      <View style={s.root}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <BackIcon color={Colors.g700} width={20} height={20} />
          </TouchableOpacity>
          <Text style={s.topBarTitle}>
            {summaryOrder?.id || 'Order Detail'}
          </Text>
          <View style={{ width: 36 }} />
        </View>
        <PastOrderDetailSkeleton />
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Top bar */}
      <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <BackIcon color={Colors.g700} width={20} height={20} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>{summaryOrder?.id || 'Order Detail'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status banner */}
        <View style={s.statusBanner}>
          <View style={s.doneCircle}>
            <CheckIcon color={Colors.green} size={18} />
          </View>
          <View>
            <Text style={s.statusTitle}>Completed</Text>
            <Text style={s.statusSub}>
              {order?.completed_at ? formatDate(order.completed_at) : '---'}
            </Text>
          </View>
        </View>

        {/* Order info card */}
        <View style={s.card}>
          <InfoRow label="Order ID" value={order?.id} />
          <InfoRow label="Type" value={isPicking ? 'Picking' : 'Put Away'} />
          <InfoRow label="Order Type" value={order?.order_type} />
          <InfoRow label="Invoice Number" value={order?.invoice_id} />
          <InfoRow
            label="Total Items"
            value={order?.items != null ? `${order.items} items` : null}
            last
          />
        </View>

        {/* Items list */}
        {order?.items_list?.length > 0 && (
          <View style={s.card}>
            <Text style={s.sectionTitle}>Items</Text>
            {order.items_list.map((item, i) => (
              <View
                key={i}
                style={[
                  s.itemRow,
                  i === order.items_list.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={s.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {!isPicking && (item.batch || item.expiry) && (
                    <Text style={s.itemMeta}>
                      {item.batch} · exp {item.expiry}
                    </Text>
                  )}
                </View>
                <View style={s.qtyBadge}>
                  <Text style={s.qtyText}>×{item.qty}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* QR code for picking orders */}
        {isPicking && (
          <View style={s.qrCard}>
            <Text style={s.qrTitle}>Invoice QR</Text>
            <Text style={s.qrSub}>Scan to confirm handover</Text>
            <View style={s.qrBox}>
              <QRCode
                value={`${ENV.ONE_APP_URL}/home?fh_order_id=${order?.invoice_id}`}
                size={150}
                color={Colors.g900}
                backgroundColor="transparent"
              />
            </View>
            <Text style={s.qrId}>Order #{order.id}</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default PastOrderDetailScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.g50 },

  topBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.g100,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.g100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.g900,
    fontFamily: 'monospace',
  },

  statusBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.greenLight,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(13,122,78,0.12)',
  },
  doneCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(13,122,78,0.2)',
  },
  statusTitle: { fontSize: 16, fontWeight: '700', color: Colors.green },
  statusSub: { fontSize: 12, color: Colors.green, opacity: 0.7, marginTop: 2 },

  card: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
  },
  infoLabel: { fontSize: 13, color: Colors.g500, fontWeight: '500' },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.g900,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
    fontFamily: 'monospace',
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.g500,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    paddingTop: 14,
    paddingBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
    gap: 10,
  },
  itemName: { fontSize: 13, fontWeight: '600', color: Colors.g900 },
  itemMeta: {
    fontSize: 11,
    color: Colors.g500,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  qtyBadge: {
    backgroundColor: Colors.g100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qtyText: { fontSize: 12, fontWeight: '700', color: Colors.g700 },

  qrCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
    alignItems: 'center',
    padding: 20,
  },
  qrTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.g900,
    marginBottom: 4,
  },
  qrSub: { fontSize: 12, color: Colors.g500, marginBottom: 18 },
  qrBox: {
    padding: 14,
    backgroundColor: Colors.g50,
    borderRadius: 12,
    marginBottom: 12,
  },
  qrId: { fontSize: 12, color: Colors.g500, fontFamily: 'monospace' },
});

const sk = StyleSheet.create({
  bone: { backgroundColor: Colors.g300, borderRadius: 6 },
  banner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.greenLight,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(13,122,78,0.12)',
  },
  bannerCircle: { width: 44, height: 44, borderRadius: 22, flexShrink: 0 },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
  },
});
