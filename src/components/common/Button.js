// src/components/common/Button.js
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import Colors from '../../theme/colors';

const VARIANTS = {
  primary: { bg: Colors.blue, text: Colors.white, border: null },
  picking: { bg: Colors.pk, text: Colors.white, border: null },
  green: { bg: Colors.green, text: Colors.white, border: null },
  white: { bg: Colors.white, text: Colors.navy, border: Colors.g300 },
  ghost: { bg: 'transparent', text: Colors.g500, border: null },
  ghostPicking: { bg: 'transparent', text: Colors.pk, border: null },
};

const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon = null,
  style,
  textStyle,
}) => {
  const v = VARIANTS[variant] || VARIANTS.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      style={[
        s.base,
        {
          backgroundColor: v.bg,
          borderWidth: v.border ? 1.5 : 0,
          borderColor: v.border ?? 'transparent',
        },
        disabled && s.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <View style={s.row}>
          {icon ? <View>{icon}</View> : null}
          <Text style={[s.label, { color: v.text }, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const s = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 15, fontWeight: '700' },
});
