// src/components/common/InfoStrip.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

const InfoStrip = ({ rows = [], style }) => (
  <View style={[s.container, style]}>
    {rows.map((row, i) => (
      <View key={i} style={[s.row, i === rows.length - 1 && s.rowLast]}>
        <Text style={s.key}>{row.label}</Text>
        <Text style={[s.value, row.valueStyle]}>{row.value}</Text>
      </View>
    ))}
  </View>
);

export default InfoStrip;

const s = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginTop: 14,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
  },
  rowLast: { borderBottomWidth: 0 },
  key: { fontSize: 14, color: Colors.g500, fontWeight: '500' },
  value: {
    fontSize: 14,
    color: Colors.g900,
    fontWeight: '700',
    textAlign: 'right',
    fontFamily: 'monospace',
    flexShrink: 1,
    marginLeft: 12,
  },
});
