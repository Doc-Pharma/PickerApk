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
import { useFocusEffect } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { CheckIcon, ChevronRightIcon } from '../../assets/Icons';
import { TopBar, Badge } from '../../components';
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
  const { order: summaryOrder } = route?.params || {};

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skuExpanded, setSkuExpanded] = useState(false);

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
  const taskTypeLabel = isPicking ? 'Picking' : 'Put Away';
  const unitsLabel = isPicking ? 'Total Units Picked' : 'Total Units Placed';
  const qtyColLabel = isPicking ? 'Picked Quantity' : 'Placed Quantity';
  const totalSkus = order?.items_list?.length ?? order?.items ?? 0;
  const totalUnits =
    order?.items_list?.reduce((sum, it) => sum + (Number(it.qty) || 0), 0) ?? 0;

  if (loading || !order) {
    return (
      <View style={s.root}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
        <TopBar
          title={summaryOrder?.id || 'Order Detail'}
          onBack={() => navigation.goBack()}
        />
        <PastOrderDetailSkeleton />
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Header */}
      <TopBar
        title={order?.id || summaryOrder?.id || 'Order Detail'}
        onBack={() => navigation.goBack()}
        right={
          <View style={s.badgeRow}>
            {order?.order_type ? (
              <View style={s.hlBadge}>
                <Text style={s.hlText}>{order.order_type}</Text>
              </View>
            ) : null}
            <Badge
              label={taskTypeLabel}
              variant={isPicking ? 'picking' : 'putaway'}
            />
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Completion summary */}
        <View style={s.statusBanner}>
          <View style={s.doneCircle}>
            <CheckIcon color={Colors.green} size={18} />
          </View>
          <View>
            <Text style={s.statusTitle}>{taskTypeLabel} Completed</Text>
            <Text style={s.statusSub}>
              {order?.completed_at ? formatDate(order.completed_at) : '---'}
            </Text>
          </View>
        </View>

        {/* Invoice QR */}
        {isPicking && (
          <View style={s.qrCard}>
            <Text style={s.sectionTitle}>Invoice QR</Text>
            <View style={[s.qrInfoRow, { borderBottomWidth: 0 }]}>
              <Text style={s.infoLabel}>Order Number</Text>
              <Text style={s.infoValue}>{order?.id || '---'}</Text>
            </View>
            <View style={s.qrBox}>
              <QRCode
                value={`${ENV.ONE_APP_URL}/home?fh_order_id=${order?.invoice_id}`}
                size={190}
                color={Colors.qrFg}
                backgroundColor={Colors.qrBg}
                quietZone={24}
              />
            </View>
          </View>
        )}

        {/* Task details */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Task Details</Text>
          <InfoRow label="Order ID" value={order?.id} />
          <InfoRow label="Order Type" value={order?.order_type} />
          <InfoRow label="Task Type" value={taskTypeLabel} />
          <InfoRow label="Total SKUs" value={totalSkus} />
          <InfoRow label={unitsLabel} value={totalUnits} last />
        </View>

        {/* SKU details — collapsible */}
        {order?.items_list?.length > 0 && (
          <View style={s.card}>
            <TouchableOpacity
              style={s.skuHeader}
              activeOpacity={0.7}
              onPress={() => setSkuExpanded(e => !e)}
            >
              <Text style={s.sectionTitleInline}>
                SKU Details ({order.items_list.length})
              </Text>
              <View
                style={{
                  transform: [{ rotate: skuExpanded ? '90deg' : '0deg' }],
                }}
              >
                <ChevronRightIcon color={Colors.g500} width={18} height={18} />
              </View>
            </TouchableOpacity>
            {skuExpanded &&
              order.items_list.map((item, i) => (
                <View
                  key={i}
                  style={[
                    s.itemRow,
                    i === order.items_list.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                >
                  <Text style={s.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={s.qtyBadge}>
                    <Text style={s.qtyText}>×{item.qty}</Text>
                  </View>
                </View>
              ))}
            {!skuExpanded && (
              <Text style={s.skuHint}>{qtyColLabel} per SKU · tap to view</Text>
            )}
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

  badgeRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  hlBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  hlText: { fontSize: 11, fontWeight: '700', color: '#991B1B' },

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
  sectionTitleInline: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.g500,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  skuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  skuHint: {
    fontSize: 12,
    color: Colors.g500,
    paddingBottom: 14,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
    gap: 10,
  },
  itemName: { flex: 1, fontSize: 13, fontWeight: '600', color: Colors.g900 },
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
    paddingHorizontal: 16,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  qrInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
  },
  qrBox: {
    padding: 6,
    backgroundColor: Colors.qrBg,
    borderRadius: 12,
    marginTop: 14,
  },
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
