import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  TopBar,
  InfoStrip,
  Button,
  Badge,
  OrderDetailSkeleton,
} from '../../components';
import { ChevronRightIcon, CheckIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import * as pickingApi from '../../api/picking';
import Toast from '../../utils/toast';

//  Product row
const ProductRow = ({ item, onPress }) => (
  <Pressable
    onPress={!item.done ? onPress : undefined}
    disabled={item.done}
    style={({ pressed }) => [
      s.row,
      item.done && s.rowDone,
      pressed && !item.done && s.rowPressed,
    ]}
  >
    <View
      style={[
        s.dot,
        { backgroundColor: item.done ? Colors.green : Colors.g300 },
      ]}
    />
    <View style={s.rowInfo}>
      <Text style={s.rowName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={s.rowSub}>{item.dp_id}</Text>
    </View>
    {item.done ? (
      <View style={s.checkCircle}>
        <CheckIcon color={Colors.green} size={12} />
      </View>
    ) : (
      <View style={s.rowRight}>
        <View style={s.qtyBadge}>
          <Text style={s.qtyText}>{item.qty}</Text>
        </View>
        <ChevronRightIcon color={Colors.g300} width={16} height={16} />
      </View>
    )}
  </Pressable>
);

//  Screen
const PickingOrderDetailScreen = ({ navigation, route }) => {
  const orderId = route?.params?.taskId;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
      fetchOrder();
    }, [orderId]),
  );

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await pickingApi.getPickingOrder(orderId);
      setOrder(res.order);
      setItems(res.items);
    } catch (err) {
      Toast.error(err?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !order) return <OrderDetailSkeleton />;

  const nextPending = items.find(i => !i.done) || items[0];

  return (
    <View style={s.safe}>
      <TopBar
        title={order.order_number || orderId}
        onBack={() => navigation.goBack()}
        right={
          <View style={s.badgeRow}>
            {order.orderType ? (
              <View style={s.hlBadge}>
                <Text style={s.hlText}>{order.orderType}</Text>
              </View>
            ) : null}
            <Badge label="Picking" variant="picking" />
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <InfoStrip
          rows={[
            { label: 'Order No.', value: order.order_number || order.id },
            { label: 'Order Type', value: order.orderType },
            { label: 'Assigned', value: order.assigned },
            { label: 'Total SKUs', value: `${order.totalSkus} items` },
            {
              label: 'Progress',
              value: `${order.done} / ${order.totalSkus} picked`,
              valueStyle: {
                color:
                  order.done === order.totalSkus ? Colors.green : Colors.g500,
              },
            },
          ]}
        />

        <Text style={s.sectionLabel}>Items to Pick</Text>

        <View style={s.list}>
          {items.map(item => (
            <ProductRow
              key={item.id}
              item={item}
              onPress={() =>
                navigation.navigate(Routes.PICKING_SCAN_PRODUCT, {
                  orderId,
                  item,
                  allItems: items,
                  partnerId: order.partner_id,
                })
              }
            />
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.footer}>
        <Button
          title="Start Picking"
          variant="picking"
          onPress={() =>
            navigation.navigate(Routes.PICKING_SCAN_PRODUCT, {
              orderId,
              item: nextPending,
              allItems: items,
              partnerId: order.partner_id,
            })
          }
        />
      </View>
    </View>
  );
};

export default PickingOrderDetailScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.g50 },
  badgeRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  hlBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  hlText: { fontSize: 11, fontWeight: '700', color: '#991B1B' },
  sectionLabel: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.g500,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  list: { paddingHorizontal: 14 },
  row: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.g100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowDone: { opacity: 0.45 },
  rowPressed: { backgroundColor: Colors.pkLight, borderColor: Colors.pk },
  dot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  rowInfo: { flex: 1, minWidth: 0 },
  rowName: { fontSize: 14, fontWeight: '600', color: Colors.g900 },
  rowSub: {
    fontSize: 12,
    color: Colors.g500,
    marginTop: 3,
    fontFamily: 'monospace',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  qtyBadge: {
    backgroundColor: Colors.g100,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
  },
  qtyText: { fontSize: 12, fontWeight: '700', color: Colors.g700 },
  footer: {
    padding: 14,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.g100,
  },
});
