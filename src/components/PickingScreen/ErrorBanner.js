// src/components/PickingScreen/ErrorBanner.js
// Matches HTML .err-banner — animated slide-in when visible=true
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { AlertIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';

const ErrorBanner = ({ visible = false, message }) => {
  const slide = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: visible ? 0 : -60,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[s.container, { transform: [{ translateY: slide }], opacity }]}
    >
      <View style={s.iconCircle}>
        <AlertIcon color={Colors.white} size={12} />
      </View>
      <Text style={s.message}>{message}</Text>
    </Animated.View>
  );
};

export default ErrorBanner;

const s = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginTop: 10,
    backgroundColor: Colors.redLight,
    borderWidth: 1,
    borderColor: 'rgba(192,73,10,0.2)',
    borderRadius: 12,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: Colors.red,
    fontWeight: '500',
    lineHeight: 20,
  },
});
