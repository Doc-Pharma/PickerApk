// src/components/PickingScreen/StepBar.js
// Matches HTML .step-bar
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

const StepBar = ({ current, total, label, accentColor = 'blue' }) => {
  const color = accentColor === 'picking' ? Colors.pk : Colors.blue;
  return (
    <View style={s.container}>
      <Text style={[s.step, { color }]}>
        Step {current} of {total}
      </Text>
      <View style={s.divider} />
      <Text style={s.label} numberOfLines={1}>
        {label}
      </Text>
      <View style={s.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[s.dot, i < current && { backgroundColor: color }]}
          />
        ))}
      </View>
    </View>
  );
};

export default StepBar;

const s = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginTop: 14,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.g100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  step: { fontSize: 14, fontWeight: '700', flexShrink: 0 },
  divider: { width: 1, height: 16, backgroundColor: Colors.g300 },
  label: { fontSize: 13, color: Colors.g700, flex: 1, fontWeight: '500' },
  dots: { flexDirection: 'row', gap: 5, flexShrink: 0 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.g300 },
});
