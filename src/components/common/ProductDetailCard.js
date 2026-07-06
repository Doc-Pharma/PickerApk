// src/components/common/ProductDetailCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

const ProductDetailCard = ({ name, rows = [], style }) => (
  <View style={[s.container, style]}>
    {name ? <Text style={s.name}>{name}</Text> : null}
    {rows.map((r, i) => (
      <View key={i} style={[s.row, i === rows.length - 1 && s.rowLast]}>
        <Text style={s.key}>{r.label}</Text>
        <Text style={[s.value, r.valueStyle]}>{r.value}</Text>
      </View>
    ))}
  </View>
);

export default ProductDetailCard;

const s = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.g900,
    marginBottom: 12,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
  },
  rowLast: { borderBottomWidth: 0 },
  key: { fontSize: 13, color: Colors.g500, fontWeight: '500' },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.g900,
    fontFamily: 'monospace',
  },
});
