// src/components/HomeScreen/TaskRow.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PickingIcon, PutAwayIcon, ChevronRightIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';

/**
 * TaskRow
 *
 * Matches HTML .task-row exactly:
 *  - White card with border                   (.task-row)
 *  - Colored icon box 40×40 rounded           (.tr-icon .pk / .pa)
 *  - ID mono text + meta sub                  (.tr-id / .tr-meta)
 *  - Right: type badge + HL badge + chevron   (.tr-badges / .ttb / .ot-hl)
 *
 * @param {{ id, type, skus, date, orderType }} item
 * @param {function} onPress
 */
const typeConfig = type => {
  switch (type) {
    case 'picking':
      return {
        icon: 'picking',
        color: Colors.pk,
        bg: Colors.pkLight,
        label: 'Picking',
      };
    case 'packing':
      return {
        icon: 'picking',
        color: Colors.pk,
        bg: Colors.pkLight,
        label: 'Packing',
      };
    default:
      return {
        icon: 'putaway',
        color: Colors.blue,
        bg: Colors.blueLight,
        label: 'Put Away',
      };
  }
};

const TaskRow = ({ item, onPress }) => {
  const cfg = typeConfig(item?.type);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.82}>
      <View style={[styles.iconBox, { backgroundColor: cfg.bg }]}>
        {cfg.icon === 'picking' ? (
          <PickingIcon color={cfg.color} size={18} />
        ) : (
          <PutAwayIcon color={cfg.color} size={18} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.id} numberOfLines={1}>
          {item?.id}
        </Text>
        <Text style={styles.meta}>
          {item?.skus} SKUs · {item?.date}
        </Text>
      </View>

      <View style={styles.badges}>
        <View style={[styles.typeBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.typeBadgeText, { color: cfg.color }]}>
            {cfg.label}
          </Text>
        </View>
        <ChevronRightIcon color={Colors.g300} size={18} />
      </View>
    </TouchableOpacity>
  );
};

export default TaskRow;

const styles = StyleSheet.create({
  // matches .task-row
  row: {
    marginHorizontal: 14,
    marginBottom: 8,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.g100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  // matches .tr-icon
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // matches .tr-icon.pk
  iconBoxPk: {
    backgroundColor: Colors.pkLight,
  },

  // matches .tr-icon.pa
  iconBoxPa: {
    backgroundColor: Colors.blueLight,
  },

  // matches .tr-info
  info: {
    flex: 1,
    minWidth: 0,
  },

  // matches .tr-id
  id: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.g900,
    fontFamily: 'monospace',
  },

  // matches .tr-meta
  meta: {
    fontSize: 12,
    color: Colors.g500,
    marginTop: 3,
  },

  // matches .tr-badges
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },

  // matches .ttb
  typeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },

  // matches .ttb-pk
  typeBadgePk: {
    backgroundColor: Colors.pkLight,
  },

  // matches .ttb-pa
  typeBadgePa: {
    backgroundColor: Colors.blueLight,
  },

  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // matches .ot .ot-hl
  hlBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },

  hlText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#991B1B',
    letterSpacing: 0.3,
  },
});
