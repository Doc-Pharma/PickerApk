// src/components/common/Badge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

const VARIANTS = {
  picking: { bg: Colors.pkLight, text: Colors.pk },
  putaway: { bg: Colors.blueLight, text: Colors.blue },
  done: { bg: Colors.greenLight, text: Colors.green },
  error: { bg: '#FEE2E2', text: '#991B1B' },
  gray: { bg: Colors.g100, text: Colors.g700 },
};

const Badge = ({ label, variant = 'gray', style }) => {
  const v = VARIANTS[variant] || VARIANTS.gray;
  return (
    <View style={[s.badge, { backgroundColor: v.bg }, style]}>
      <Text style={[s.text, { color: v.text }]}>{label}</Text>
    </View>
  );
};

export default Badge;

const s = StyleSheet.create({
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
});
