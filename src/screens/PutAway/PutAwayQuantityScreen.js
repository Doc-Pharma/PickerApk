// src/screens/PutAway/PutAwayQuantityScreen.js
import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { TopBar, StepBar, ProductDetailCard, Button } from '../../components';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';

const PutAwayQuantityScreen = ({ navigation, route }) => {
  const { taskId, product } = route?.params || {};
  const qty = product?.remainingQty;
  const unit = 'units';

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
    }, []),
  );

  return (
    <View style={s.safe}>
      <TopBar title="Quantity to Place" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <StepBar
          current={2}
          total={3}
          label="Confirm quantity to place"
          accentColor="blue"
        />

        <ProductDetailCard
          name={product?.name}
          style={{ marginTop: 14 }}
          rows={[
            { label: 'Batch', value: product?.batch },
            { label: 'Partner', value: product?.partner_name },
            {
              label: 'Location',
              value: product?.destination,
              valueStyle: { color: Colors.blue },
            },
          ]}
        />

        {/* Quantity display — matches HTML .qty-box */}
        <View style={s.qtyBox}>
          <Text style={s.qtyLabel}>Quantity to Place</Text>
          <View style={s.qtyDisplay}>
            <Text style={s.qtyNum}>{qty}</Text>
            <Text style={s.qtyUnit}>{unit}</Text>
          </View>
          <View style={s.qtyNote}>
            <Text style={s.qtyNoteText}>
              This quantity is fixed from the inward receipt and{' '}
              <Text style={{ fontWeight: '700' }}>cannot be changed.</Text>{' '}
              Place exactly{' '}
              <Text style={{ fontWeight: '700' }}>
                {qty} {unit}
              </Text>{' '}
              at the designated location.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={s.footer}>
        <Button
          title="Next — Scan Location →"
          variant="primary"
          onPress={() =>
            navigation.navigate(Routes.PUT_AWAY_SCAN_LOCATION, {
              taskId,
              product,
              qty,
            })
          }
        />
      </View>
    </View>
  );
};

export default PutAwayQuantityScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.g50 },
  // matches .qty-box
  qtyBox: {
    marginHorizontal: 14,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.g100,
  },
  qtyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.g500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 18,
  },
  qtyDisplay: { alignItems: 'center', gap: 6 },
  // matches .qty-num
  qtyNum: {
    fontSize: 54,
    fontWeight: '700',
    color: Colors.g900,
    fontFamily: 'monospace',
    lineHeight: 60,
  },
  // matches .qty-unit
  qtyUnit: { fontSize: 15, color: Colors.g500, fontWeight: '500' },
  // matches .qty-note
  qtyNote: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.g50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.g100,
  },
  qtyNoteText: {
    fontSize: 13,
    color: Colors.g700,
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    padding: 14,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.g100,
  },
});
