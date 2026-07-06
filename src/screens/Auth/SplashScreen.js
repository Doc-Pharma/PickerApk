import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';

// Pure guest-flow splash: shows logo, then "Continue to Login".
// Update check and auth routing are handled by AppNavigator — not here.
const SplashScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    StatusBar.setBackgroundColor(Colors.white);

    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After logo animates in, reveal the button
      Animated.sequence([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.timing(btnOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  return (
    <View style={[s.root, { paddingBottom: insets.bottom + 24 }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <View style={s.logoWrap}>
        <Animated.Image
          source={require('../../assets/logo.png')}
          style={[
            s.logo,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
          resizeMode="contain"
        />
      </View>

      <View style={s.action}>
        <Animated.Text style={[s.subtitle, { opacity: textOpacity }]}>
          Continue to Login
        </Animated.Text>

        <Animated.View style={{ opacity: btnOpacity, width: '100%' }}>
          <TouchableOpacity
            style={s.btn}
            activeOpacity={0.85}
            onPress={() => navigation?.navigate(Routes.LOGIN)}
          >
            <Text style={s.btnText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default SplashScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: { width: 250, height: 250 },
  action: { paddingHorizontal: 24, paddingBottom: 8, alignItems: 'center' },
  subtitle: { fontSize: 14, color: Colors.g500, marginBottom: 20 },
  btn: {
    width: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 13,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
