// src/screens/PutAway/PutAwayPlacedScreen.js
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import * as paApi from '../../api/putaway';
import useApi from '../../hooks/useApi';
import Toast from '../../utils/toast';

const PutAwayPlacedScreen = ({ navigation, route }) => {
  const { taskId, product, qty, location } = route?.params || {};
  const scale = useRef(new Animated.Value(0)).current;
  const [marked, setMarked] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const { loading, execute: doMarkComplete } = useApi(paApi.markTaskComplete, {
    suppressToast: true,
  });

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

  const handleMarkPlaced = async () => {
    try {
      const res = await doMarkComplete(product?.id);
      console.log('Mark placed response:', res?.data);
      setOrderCompleted(res?.data?.is_order_completed == true);
      setMarked(true);
      Toast.success('Item marked as placed!');
    } catch (err) {
      Toast.error(err?.message || 'Failed to mark item. Try again.');
    }
  };

  return (
    <View style={s.safe}>
      <TopBar title="Item Placed ✓" />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[s.iconCircle, { transform: [{ scale }] }]}>
          <CheckIcon color={Colors.green} size={36} />
        </Animated.View>

        <Text style={s.title}>Placed Successfully</Text>
        <Text style={s.subtitle}>
          {product?.name || 'Item'} confirmed at the correct bin location.
        </Text>

        <View style={s.summaryCard}>
          {[
            { k: 'Product', v: product?.dpId || product?.name || '—' },
            { k: 'Batch', v: product?.batch || '—' },
            { k: 'Location', v: location || '—' },
            { k: 'Qty Placed', v: `${qty ?? '—'} units` },
          ].map((row, i) => (
            <View key={i} style={s.summaryRow}>
              <Text style={s.summaryKey}>{row.k}</Text>
              <Text style={s.summaryVal}>{row.v}</Text>
            </View>
          ))}
        </View>

        {!marked ? (
          <Button
            title={loading ? 'Marking…' : 'Item Placed at Location'}
            variant="green"
            loading={loading}
            onPress={handleMarkPlaced}
            style={s.primaryBtn}
          />
        ) : orderCompleted ? (
          <Button
            title="Complete Task"
            variant="green"
            onPress={() =>
              navigation.navigate(Routes.PUT_AWAY_COMPLETE, { taskId })
            }
            style={s.primaryBtn}
          />
        ) : (
          <Button
            title="Scan Next Item →"
            variant="green"
            onPress={() =>
              navigation.navigate(Routes.PUT_AWAY_DETAIL, { taskId })
            }
            style={s.primaryBtn}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default PutAwayPlacedScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.greenLight,
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
    backgroundColor: Colors.greenLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(13,122,78,0.12)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryKey: { fontSize: 12, fontWeight: '600', color: Colors.green },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.g900,
    fontFamily: 'monospace',
  },
  primaryBtn: { marginBottom: 10, width: '100%' },
});
