// src/components/common/TopBar.js
// Handles safe-area top padding internally.
// Screens use edges={[]} on SafeAreaView and let TopBar push itself down.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';

/**
 * TopBar
 * title    string
 * onBack   () => void   (hidden if undefined)
 * right    ReactNode    optional right slot
 * subtitle string       optional subtitle below title
 */
const TopBar = ({ title, subtitle, onBack, right }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { paddingTop: insets.top + 10 }]}>
      {/* Left: back button or spacer */}
      {onBack ? (
        <TouchableOpacity
          style={s.backBtn}
          onPress={onBack}
          activeOpacity={0.75}
        >
          <BackIcon color={Colors.g700} width={20} height={20} />
        </TouchableOpacity>
      ) : (
        <View style={s.placeholder} />
      )}

      {/* Center */}
      <View style={s.titleWrap}>
        <Text style={s.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
      </View>

      {/* Right slot */}
      {right ?? <View style={s.placeholder} />}
    </View>
  );
};

export default TopBar;

const s = StyleSheet.create({
  // matches .topbar
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g100,
  },
  // matches .back-btn
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.g100,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  placeholder: { width: 36 },
  titleWrap: { flex: 1 },
  // matches .tb-title
  title: { fontSize: 17, fontWeight: '700', color: Colors.g900 },
  // matches .tb-sub
  subtitle: { fontSize: 13, color: Colors.g500, marginTop: 2 },
});
