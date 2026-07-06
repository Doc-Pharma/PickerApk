// src/components/HomeScreen/ActiveTaskCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PickingIcon, PutAwayIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';

const typeConfig = type => {
  switch (type) {
    case 'picking':
      return {
        color: Colors.pk,
        cardBg: '#9A3E1A',
        label: 'Picking',
        btnLabel: 'Continue Picking',
        progLabel: 'items picked',
        icon: 'picking',
      };
    case 'packing':
      return {
        color: Colors.pk,
        cardBg: '#9A3E1A',
        label: 'Packing',
        btnLabel: 'Continue Packing',
        progLabel: 'items packed',
        icon: 'picking',
      };
    default:
      return {
        color: Colors.blue,
        cardBg: Colors.blue,
        label: 'Put Away',
        btnLabel: 'Continue Put Away',
        progLabel: 'items placed',
        icon: 'putaway',
      };
  }
};

const ActiveTaskCard = ({ item, onPress }) => {
  const cfg = typeConfig(item?.type);

  const progress =
    item?.total > 0 ? Math.min((item.done / item.total) * 100, 100) : 0;

  return (
    <View style={[styles.card, { backgroundColor: cfg.cardBg }]}>
      <View style={styles.shine} />

      <View style={styles.topRow}>
        <Text style={styles.id}>{item?.id}</Text>
        <View style={styles.badge}>
          {cfg.icon === 'picking' ? (
            <PickingIcon color="rgba(255,255,255,0.9)" size={12} />
          ) : (
            <PutAwayIcon color="rgba(255,255,255,0.9)" size={12} />
          )}
          <Text style={styles.badgeText}>{cfg.label}</Text>
        </View>
      </View>

      <Text style={styles.meta}>
        {item?.total} SKUs · {item?.date}
      </Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.progLabel}>
        {item?.done} of {item?.total} {cfg.progLabel}
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={onPress}
        activeOpacity={0.88}
      >
        <Text style={[styles.btnText, { color: cfg.color }]}>
          {cfg.btnLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActiveTaskCard;

const styles = StyleSheet.create({
  // matches .active-card
  card: {
    marginHorizontal: 14,
    marginBottom: 4,
    borderRadius: 18,
    padding: 18,
    overflow: 'hidden',
    position: 'relative',
  },

  // matches .ac-shine
  shine: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },

  // matches .hd-top row within card
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  // matches .ac-id
  id: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },

  // matches .ac-badge
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  // matches .ac-badge text
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // matches .ac-meta
  meta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 14,
  },

  // matches .ac-track
  track: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    height: 5,
    marginBottom: 5,
    overflow: 'hidden',
  },

  // matches .ac-fill
  fill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },

  // matches .ac-prog-lbl
  progLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 14,
  },

  // matches .ac-btn
  btn: {
    width: '100%',
    paddingVertical: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // matches .pa .ac-btn color / .pk .ac-btn color (set dynamically above)
  btnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
