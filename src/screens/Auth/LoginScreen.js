import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BackIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import { sendOTP } from '../../api/auth';
import Toast from '../../utils/toast';

const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
      // Auto-focus input
      setTimeout(() => inputRef.current?.focus(), 400);
    }, []),
  );

  const handleLogin = async () => {
    setError('');

    // Validation
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      await sendOTP(phone);
      navigation.navigate(Routes.OTP, { phone });
    } catch (err) {
      const msg = err?.message || 'Failed to send OTP. Please try again.';
      setError(msg);
      Toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* ── TopBar ── matches HTML topbar for login */}
      <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <BackIcon color={Colors.g700} width={20} height={20} />
        </TouchableOpacity>
        <View style={s.topBarText}>
          <Text style={s.topBarTitle}>Log In</Text>
          <Text style={s.topBarSub}>Enter registered mobile number</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Auth card ── matches .auth-card */}
        <View style={s.card}>
          {/* Label */}
          <Text style={s.label}>Phone number</Text>

          {/* Phone input row — matches .phone-input */}
          <View style={[s.inputRow, error ? s.inputRowError : null]}>
            <Text style={s.countryCode}>+91</Text>
            <View style={s.divider} />
            <TextInput
              ref={inputRef}
              style={s.input}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor={Colors.g300}
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={t => {
                setPhone(t.replace(/[^0-9]/g, ''));
                if (error) setError('');
              }}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          {/* Error banner — matches .auth-error */}
          {error ? (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* CTA button */}
          <TouchableOpacity
            style={[s.btn, loading && s.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={s.btnText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.g50,
  },

  // ── TopBar ───────────────────────────────────────────────────────────────
  topBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g100,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.g100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarText: { flex: 1 },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: Colors.g900 },
  topBarSub: { fontSize: 13, color: Colors.g500, marginTop: 2 },

  // ── Scroll ────────────────────────────────────────────────────────────────
  scroll: {
    padding: 24,
    gap: 16,
  },

  // ── Auth card ── matches .auth-card border-radius:22 ─────────────────────
  card: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.g100,
    padding: 20,
    gap: 0,
  },

  // matches .input-label
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.g500,
    marginBottom: 8,
  },

  // matches .phone-input
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.g50,
    borderWidth: 1,
    borderColor: Colors.g100,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  inputRowError: {
    borderColor: Colors.red,
  },

  // matches .country-code
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.g900,
    flexShrink: 0,
  },

  divider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.g300,
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.g900,
    padding: 0,
  },

  // matches .auth-error
  errorBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.redLight,
    borderWidth: 1,
    borderColor: 'rgba(192,73,10,0.15)',
    borderRadius: 12,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.red,
  },

  // matches .cta.cta-p
  btn: {
    width: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
