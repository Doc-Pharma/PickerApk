import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import OTPVerify from 'react-native-otp-verify';
import { BackIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import { verifyOTP, sendOTP, getProfile } from '../../api/auth';
import { setAuthToken } from '../../api/client';
import Toast from '../../utils/toast';
import { useUser } from '../../context/UserContext';

const OTP_LENGTH = 4;

const OTPScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const phone = route?.params?.phone || '';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCD, setResendCD] = useState(30);

  const { setAuth } = useUser();

  const inputRefs = useRef([]);

  //  Auto-focus first box on screen focus
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
      setTimeout(() => inputRefs.current[0]?.focus(), 400);
    }, []),
  );

  //  Resend countdown
  useEffect(() => {
    if (resendCD <= 0) return;
    const t = setTimeout(() => setResendCD(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCD]);

  //  Auto OTP read (Android only)
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    // Start listening for SMS
    OTPVerify.getOtp()
      .then(() => {
        // Register handler — called when matching SMS arrives
        OTPVerify.addListener(message => {
          // Extract 4-digit OTP from SMS text
          // Adjust regex if your OTP length/format differs
          const match = message?.match(/\b(\d{4})\b/);
          if (match) {
            const detectedOtp = match[1];
            const digits = detectedOtp.split('');

            // Fill all boxes
            setOtp(digits);
            setError('');

            // Auto-verify after short delay so user sees it fill
            setTimeout(() => handleVerify(detectedOtp), 500);
          }
        });
      })
      .catch(err => {
        // SMS retriever not available — fail silently, user types manually
      });

    // Cleanup listener when screen unmounts
    return () => {
      OTPVerify.removeListener();
    };
  }, []);

  //  Handle single digit input ───
  const handleChange = (text, index) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError('');

    // Auto-advance to next box
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 filled
    if (digit && index === OTP_LENGTH - 1) {
      const full = next.join('');
      if (full.length === OTP_LENGTH) handleVerify(full);
    }
  };

  //  Handle backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  //  Verify OTP
  const handleVerify = async code => {
    const otpCode = code || otp.join('');
    if (otpCode.length < OTP_LENGTH) {
      setError('Please enter the 4-digit OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const verifyRes = await verifyOTP(phone, otpCode);
      const token = verifyRes?.token || verifyRes?.data?.token;
      const userFromVerify = verifyRes?.user || verifyRes?.data?.user;

      if (!token) {
        throw new Error('Token missing after OTP verification.');
      }

      let profile = userFromVerify;
      if (!profile) {
        setAuthToken(token);
        profile = await getProfile();
      }

      setAuth({
        token,
        user: profile,
      });
    } catch (err) {
      const msg = err?.message || 'Invalid OTP. Please try again.';
      setError(msg);
      Toast.error(msg);
      setOtp(['', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  //  Resend OTP
  const handleResend = async () => {
    if (resendCD > 0) return;
    try {
      await sendOTP(phone);
      setResendCD(30);
      setOtp(['', '', '', '']);
      setError('');
      Toast.info('OTP sent again!');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);

      // Restart SMS listener for the new OTP
      if (Platform.OS === 'android') {
        OTPVerify.removeListener();
        OTPVerify.getOtp()
          .then(() => {
            OTPVerify.addListener(message => {
              const match = message?.match(/\b(\d{4})\b/);
              if (match) {
                const detectedOtp = match[1];
                setOtp(detectedOtp.split(''));
                setTimeout(() => handleVerify(detectedOtp), 500);
              }
            });
          })
          .catch(() => {});
      }
    } catch (err) {
      Toast.error(err?.message || 'Failed to resend OTP.');
    }
  };

  //  Render
  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* TopBar */}
      <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <BackIcon color={Colors.g700} width={20} height={20} />
        </TouchableOpacity>
        <View style={s.topBarText}>
          <Text style={s.topBarTitle}>Enter OTP to verify</Text>
          <Text style={s.topBarSub}>Enter the code sent to your phone</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.card}>
          {/* Sent to text */}
          <Text style={s.sentText}>
            We have sent an OTP to <Text style={s.sentPhone}>+91 {phone}</Text>
          </Text>

          {/* OTP boxes */}
          <View style={s.otpRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={r => (inputRefs.current[i] = r)}
                style={[
                  s.otpBox,
                  digit && s.otpBoxFilled,
                  error && s.otpBoxError,
                ]}
                value={digit}
                onChangeText={t => handleChange(t, i)}
                onKeyPress={e => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                textAlign="center"
              />
            ))}
          </View>

          {/* Auto-read hint */}
          {Platform.OS === 'android' && (
            <Text style={s.autoHint}>OTP will be filled automatically</Text>
          )}

          {/* Error */}
          {error ? (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Verify button */}
          <TouchableOpacity
            style={[s.btn, loading && s.btnDisabled]}
            onPress={() => handleVerify()}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={s.btnText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          {/* Resend */}
          <TouchableOpacity
            style={s.resendBtn}
            onPress={handleResend}
            disabled={resendCD > 0}
            activeOpacity={0.7}
          >
            <Text style={[s.resendText, resendCD > 0 && s.resendDisabled]}>
              {resendCD > 0 ? `Resend OTP in ${resendCD}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTPScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.g50 },

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

  scroll: { padding: 24 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.g100,
    padding: 22,
  },

  sentText: {
    fontSize: 14,
    color: Colors.g700,
    marginBottom: 20,
    lineHeight: 22,
  },
  sentPhone: { fontWeight: '700', color: Colors.g900 },

  otpRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 4,
  },

  otpBox: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.g300,
    borderRadius: 14,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.g900,
    backgroundColor: Colors.white,
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: Colors.blue,
    backgroundColor: Colors.blueLight,
  },
  otpBoxError: { borderColor: Colors.red },

  // Auto-read hint text
  autoHint: {
    fontSize: 12,
    color: Colors.g500,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },

  errorBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.redLight,
    borderWidth: 1,
    borderColor: 'rgba(192,73,10,0.15)',
    borderRadius: 12,
  },
  errorText: { fontSize: 13, fontWeight: '600', color: Colors.red },

  btn: {
    width: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { fontSize: 15, fontWeight: '700', color: Colors.white },

  resendBtn: { alignItems: 'center', paddingVertical: 12, marginTop: 4 },
  resendText: { fontSize: 13, fontWeight: '600', color: Colors.blue },
  resendDisabled: { color: Colors.g500 },
});
