import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useBarcodeScanner } from '@mgcrea/vision-camera-barcode-scanner';
import { useRunOnJS } from 'react-native-worklets-core';

import CameraPermissionGate from './CameraPermissionGate';
import { FlashIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';

const FRAME = 200;
const WRAPPER_HEIGHT = 260;
const ZOOM_FACTOR = 1.5;

const ScanArea = ({
  status = 'idle',
  hint = 'Point camera at QR code',
  accentColor = 'blue',
  onScanned,
  active = true,
}) => {
  const accent =
    status === 'ok'
      ? Colors.green
      : status === 'error'
      ? Colors.red
      : accentColor === 'picking'
      ? Colors.pk
      : Colors.blue;

  const bg =
    status === 'ok' ? '#052E1C' : status === 'error' ? '#1A0505' : '#0A1628';

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const lineY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 60],
  });

  const device = useCameraDevice('back');
  const [torch, setTorch] = useState(false);

  const zoom = device
    ? Math.min(
        device.maxZoom,
        Math.max(device.minZoom, device.neutralZoom * ZOOM_FACTOR),
      )
    : 1;

  const lastScanned = useRef(null);

  const handleBarcodeOnJS = useRunOnJS(
    code => {
      if (!code || code === lastScanned.current) return;
      lastScanned.current = code;
      onScanned?.(code);
      setTimeout(() => {
        lastScanned.current = null;
      }, 2000);
    },
    [onScanned],
  );

  const { props: cameraProps } = useBarcodeScanner({
    fps: 5,
    barcodeTypes: ['qr', 'code-128', 'code-39', 'ean-13'],
    onBarcodeScanned: barcodes => {
      'worklet';
      if (!barcodes?.length) return;
      const code = barcodes[0]?.value;
      if (code) handleBarcodeOnJS(code);
    },
  });

  // Scan frame corners — inlined to avoid inner-component remount issue
  const scanFrame = (
    <View style={s.frame}>
      <View style={[s.corner, s.tl, { borderColor: accent }]} />
      <View style={[s.corner, s.tr, { borderColor: accent }]} />
      <View style={[s.corner, s.bl, { borderColor: accent }]} />
      <View style={[s.corner, s.br, { borderColor: accent }]} />
      <Animated.View
        style={[
          s.scanLine,
          {
            backgroundColor: accent,
            shadowColor: accent,
            transform: [{ translateY: lineY }],
          },
        ]}
      />
    </View>
  );

  return (
    <CameraPermissionGate accentColor={accentColor}>
      <View style={[s.wrapper, { backgroundColor: bg }]}>
        {device && (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={active && status !== 'ok'}
            torch={torch ? 'on' : 'off'}
            zoom={zoom}
            {...cameraProps}
          />
        )}
        <View style={s.focusOverlay} pointerEvents="none">
          <View style={s.dimEdge} />
          <View style={s.dimRow}>
            <View style={s.dimEdge} />
            <View style={s.clearWindow} />
            <View style={s.dimEdge} />
          </View>
          <View style={s.dimEdge} />
        </View>
        {scanFrame}
        {device && (
          <TouchableOpacity
            style={[s.torchBtn, torch && s.torchBtnActive]}
            onPress={() => setTorch(t => !t)}
            activeOpacity={0.8}
          >
            <FlashIcon color={torch ? Colors.pk : Colors.white} size={18} />
          </TouchableOpacity>
        )}
        <Text style={s.hint}>{hint}</Text>
      </View>
    </CameraPermissionGate>
  );
};

export default ScanArea;

const s = StyleSheet.create({
  wrapper: {
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 18,
    height: WRAPPER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  focusOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
  },
  dimEdge: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  dimRow: {
    height: FRAME,
    flexDirection: 'row',
  },
  clearWindow: {
    width: FRAME,
    height: FRAME,
  },
  frame: {
    width: FRAME,
    height: FRAME,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  corner: { position: 'absolute', width: 22, height: 22 },
  tl: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 3,
  },
  tr: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 3,
  },
  bl: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 3,
  },
  br: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 3,
  },
  scanLine: {
    position: 'absolute',
    left: 3,
    right: 3,
    height: 2,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
  torchBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  torchBtnActive: {
    backgroundColor: Colors.pkLight,
  },
  hint: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    zIndex: 2,
  },
});
