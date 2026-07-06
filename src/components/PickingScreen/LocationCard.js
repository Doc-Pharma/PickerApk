// src/components/PickingScreen/LocationCard.js
// Matches HTML .loc-card
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

const LocationCard = ({
  label,
  location,
  chips = [],
  accentColor = 'blue',
}) => {
  const bg = accentColor === 'picking' ? Colors.pkDark : Colors.blueDark;
  return (
    <View style={[s.container, { backgroundColor: bg }]}>
      <View style={s.glow} />
      <Text style={s.label}>{label}</Text>
      <Text style={s.location}>{location}</Text>
      <View style={s.chips}>
        {chips.map((chip, i) => (
          <View key={i} style={s.chip}>
            <Text style={s.chipText}>{chip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LocationCard;

const s = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 5,
  },
  location: {
    fontFamily: 'monospace',
    fontSize: 26,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipText: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
});
