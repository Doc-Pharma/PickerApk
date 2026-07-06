// src/components/PickingScreen/PickingSkeleton.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';

// ── Shimmer bone ──────────────────────────────────────────────────────────────
const Bone = ({ style }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 850,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [anim]);
  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.85],
  });
  return <Animated.View style={[s.bone, style, { opacity }]} />;
};

// ── TopBar ────────────────────────────────────────────────────────────────────
export const TopBarSkeleton = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
      <Bone style={s.backBtn} />
      <Bone style={s.topBarTitle} />
      <Bone style={s.backBtn} />
    </View>
  );
};

// ── InfoStrip ─────────────────────────────────────────────────────────────────
export const InfoStripSkeleton = ({ rows = 4 }) => (
  <View style={s.infoStrip}>
    {Array.from({ length: rows }).map((_, i) => (
      <View
        key={i}
        style={[s.infoRow, i === rows - 1 && { borderBottomWidth: 0 }]}
      >
        <Bone style={s.infoKey} />
        <Bone style={s.infoVal} />
      </View>
    ))}
  </View>
);

// ── Product list ──────────────────────────────────────────────────────────────
export const ProductListSkeleton = ({ count = 3 }) => (
  <View style={s.list}>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={s.productRow}>
        <Bone style={s.dot} />
        <View style={{ flex: 1, gap: 8 }}>
          <Bone style={s.productName} />
          <Bone style={s.productSub} />
        </View>
        <Bone style={s.qtyBadge} />
      </View>
    ))}
  </View>
);

// ── Scan area ─────────────────────────────────────────────────────────────────
export const ScanAreaSkeleton = () => (
  <View style={s.scanWrap}>
    <Bone style={StyleSheet.absoluteFillObject} />
  </View>
);

// ── StepBar ───────────────────────────────────────────────────────────────────
export const StepBarSkeleton = () => (
  <View style={s.stepBar}>
    <Bone style={s.stepText} />
    <View style={s.stepDiv} />
    <Bone style={s.stepLabel} />
    <View style={s.stepDots}>
      <Bone style={s.stepDot} />
      <Bone style={s.stepDot} />
    </View>
  </View>
);

// ── Section label ─────────────────────────────────────────────────────────────
const SectionSkeleton = () => (
  <View style={s.section}>
    <Bone style={{ width: 100, height: 11 }} />
  </View>
);

// ── Full order detail skeleton ────────────────────────────────────────────────
export const OrderDetailSkeleton = () => (
  <>
    <TopBarSkeleton />
    <InfoStripSkeleton rows={5} />
    <SectionSkeleton />
    <ProductListSkeleton count={3} />
  </>
);

// ── Full scan product skeleton ────────────────────────────────────────────────
export const ScanProductSkeleton = () => (
  <>
    <TopBarSkeleton />
    <StepBarSkeleton />
    <Bone style={s.locationCard} />
    <Bone style={s.productCard} />
    <ScanAreaSkeleton />
  </>
);

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  bone: { backgroundColor: Colors.g300, borderRadius: 6 },

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
  backBtn: { width: 36, height: 36, borderRadius: 10 },
  topBarTitle: { flex: 1, height: 14 },

  infoStrip: {
    marginHorizontal: 14,
    marginTop: 14,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
  },
  infoKey: { width: 80, height: 11 },
  infoVal: { width: 120, height: 11 },

  list: { paddingHorizontal: 14, marginTop: 8 },
  productRow: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.g100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  productName: { height: 13, width: '70%' },
  productSub: { height: 11, width: '50%' },
  qtyBadge: { width: 32, height: 24, borderRadius: 6 },

  scanWrap: {
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 18,
    height: 260,
    backgroundColor: Colors.g100,
    overflow: 'hidden',
  },

  stepBar: {
    marginHorizontal: 14,
    marginTop: 14,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.g100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepText: { width: 70, height: 12 },
  stepDiv: { width: 1, height: 16, backgroundColor: Colors.g300 },
  stepLabel: { flex: 1, height: 11 },
  stepDots: { flexDirection: 'row', gap: 5 },
  stepDot: { width: 7, height: 7, borderRadius: 4 },

  section: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 8 },
  locationCard: {
    marginHorizontal: 14,
    marginTop: 12,
    height: 100,
    borderRadius: 16,
  },
  productCard: {
    marginHorizontal: 14,
    marginTop: 12,
    height: 80,
    borderRadius: 14,
  },
});
