// src/components/PickingScreen/CameraPermissionGate.js
// Wraps any scanner component and handles all camera permission states:
//   unknown → "Allow Camera" button
//   requesting → spinner
//   denied → "Try Again"
//   blocked → "Open Settings" (deep link)
//   granted → renders children (real camera)

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { CameraIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import useCameraPermission from '../../hooks/useCameraPermission';

const CameraPermissionGate = ({ children, accentColor = 'blue' }) => {
  const { hasPermission, status, requesting, requestPermission, openSettings } =
    useCameraPermission();

  const accent = accentColor === 'picking' ? Colors.pk : Colors.blue;
  const accentLight =
    accentColor === 'picking' ? Colors.pkLight : Colors.blueLight;

  // ── Granted: render the real scanner ─────────────────────────────────────
  if (hasPermission) return <>{children}</>;

  // ── Requesting / loading ──────────────────────────────────────────────────
  if (requesting || status === 'requesting') {
    return (
      <View style={s.box}>
        <ActivityIndicator color={accent} size="large" />
        <Text style={s.subText}>Requesting camera access…</Text>
      </View>
    );
  }

  // ── Blocked: permanently denied, must go to Settings ─────────────────────
  if (status === 'blocked') {
    return (
      <View style={s.box}>
        <View style={[s.iconBox, { backgroundColor: accentLight }]}>
          <CameraIcon color={accent} size={30} />
        </View>
        <Text style={s.title}>Camera Access Required</Text>
        <Text style={s.subText}>
          Camera permission was denied. Please enable it in Settings to scan QR
          codes.
        </Text>
        <TouchableOpacity
          style={[s.btn, { backgroundColor: accent }]}
          onPress={openSettings}
          activeOpacity={0.85}
        >
          <Text style={s.btnText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Unknown / first-time / denied (can re-ask) ────────────────────────────
  return (
    <View style={s.box}>
      <View style={[s.iconBox, { backgroundColor: accentLight }]}>
        <CameraIcon color={accent} size={30} />
      </View>
      <Text style={s.title}>Camera Permission Needed</Text>
      <Text style={s.subText}>
        This app needs camera access to scan product and bin QR codes.
      </Text>
      <TouchableOpacity
        style={[s.btn, { backgroundColor: accent }]}
        onPress={requestPermission}
        activeOpacity={0.85}
      >
        <Text style={s.btnText}>Allow Camera</Text>
      </TouchableOpacity>
      {status === 'denied' && (
        <Text style={s.deniedNote}>
          Still not working? Go to Settings → PickerApp → Camera and enable
          manually.
        </Text>
      )}
    </View>
  );
};

export default CameraPermissionGate;

const s = StyleSheet.create({
  // same size as ScanArea wrapper so layout doesn't jump
  box: {
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 18,
    height: 260,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 12,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },
  subText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  btn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  deniedNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
});
