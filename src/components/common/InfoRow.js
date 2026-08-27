import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

/**
 * InfoRow — the label/value pair used by the detail cards
 * (Past Order, Product, Profile).
 *
 * `mono` renders the value in the monospace face the detail cards use;
 * Profile opts out of it. `size` covers the 13px/14px variants and also
 * drives the row's vertical padding so the rows stay proportional.
 */
const InfoRow = ({
  label,
  value,
  valueStyle,
  last = false,
  mono = true,
  size = 13,
  placeholder = '---',
}) => {
  const isEmpty = value === null || value === undefined || value === '';

  return (
    <View style={[s.row, { paddingVertical: size }, last && s.rowLast]}>
      <Text style={[s.label, { fontSize: size }]}>{label}</Text>
      <Text
        style={[s.value, { fontSize: size }, mono && s.mono, valueStyle]}
        numberOfLines={1}
      >
        {isEmpty ? placeholder : String(value)}
      </Text>
    </View>
  );
};

export default InfoRow;

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
  },
  rowLast: { borderBottomWidth: 0 },
  label: { color: Colors.g500, fontWeight: '500' },
  value: {
    fontWeight: '700',
    color: Colors.g900,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  mono: { fontFamily: 'monospace' },
});
