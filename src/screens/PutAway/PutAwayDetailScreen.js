// src/screens/PutAway/PutAwayDetailScreen.js
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
  PutAwayDetailSkeleton,
} from '../../components';
import { ChevronRightIcon, CheckIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import * as paApi from '../../api/putaway';
import Toast from '../../utils/toast';

//  Product row ─
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
      <Text style={s.rowSub}>{item.batch_number}</Text>
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

// Screen
const PutAwayDetailScreen = ({ navigation, route }) => {
  const taskId = route?.params?.taskId;

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState();
  const [items, setItems] = useState();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
      fetchTask();
    }, [taskId]),
  );

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await paApi.getPutAwayTask(taskId);
      setTask(res?.data?.task);
      setItems(res?.data?.items ?? []);
    } catch (err) {
      Toast.error(err?.message || 'Failed to load put away task');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !task) return <PutAwayDetailSkeleton />;

  const nextPending = items.find(i => !i.done) || items[0];

  return (
    <View style={s.safe}>
      <TopBar
        title={taskId}
        subtitle="Put Away Task"
        onBack={() => navigation.goBack()}
        right={
          <View style={{ alignSelf: 'center' }}>
            <Badge label="Put Away" variant="putaway" />
          </View>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <InfoStrip
          rows={[
            { label: 'Invoice', value: task.invoice },
            { label: 'Assigned', value: task.assigned },
            { label: 'Total SKUs', value: `${task.totalSkus} items` },
            {
              label: 'Progress',
              value: `${task.done} / ${task.totalSkus} placed`,
              valueStyle: {
                color:
                  task.done === task.totalSkus ? Colors.green : Colors.green,
              },
            },
          ]}
        />

        <Text style={s.sectionLabel}>Products</Text>

        <View style={s.list}>
          {items.map(item => (
            <ProductRow
              key={item.id}
              item={item}
              onPress={() =>
                navigation.navigate(Routes.PUT_AWAY_SCAN_PRODUCT, {
                  taskId,
                  item,
                  partnerName: task.partner_name,
                })
              }
            />
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.footer}>
        <Button
          title="Continue Put Away"
          variant="primary"
          onPress={() =>
            navigation.navigate(Routes.PUT_AWAY_SCAN_PRODUCT, {
              taskId,
              item: nextPending,
              partnerName: task.partner_name,
            })
          }
        />
      </View>
    </View>
  );
};

export default PutAwayDetailScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.g50 },
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
  rowPressed: { backgroundColor: Colors.blueLight, borderColor: Colors.blue },
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
