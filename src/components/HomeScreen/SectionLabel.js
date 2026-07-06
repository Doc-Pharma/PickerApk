// src/components/HomeScreen/SectionLabel.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

/**
 * SectionLabel
 * Matches HTML .sec-lbl:
 *   padding:16px 18px 8px  |  font-size:11px  |  font-weight:700
 *   color: g500  |  text-transform:uppercase  |  letter-spacing:.8px
 */
const SectionLabel = ({ label }) => <Text style={s.label}>{label}</Text>;

export default SectionLabel;

const s = StyleSheet.create({
  label: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.g500,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
