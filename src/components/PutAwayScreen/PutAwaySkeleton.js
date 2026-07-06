// src/components/PutAwayScreen/PutAwaySkeleton.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';

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

// TopBar skeleton (blue accent for PutAway)
export const PATopBarSkeleton = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
      <Bone style={s.backBtn} />
      <Bone style={s.topBarTitle} />
      <Bone style={{ width: 70, height: 24, borderRadius: 6 }} />
    </View>
  );
};

// Product list skeleton (for task detail)
export const PAProductListSkeleton = ({ count = 5 }) => (
  <View style={s.list}>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={[s.productRow, i < 3 && s.productRowDone]}>
        <Bone style={s.dot} />
        <View style={{ flex: 1, gap: 8 }}>
          <Bone style={s.productName} />
          <Bone style={s.productSub} />
        </View>
        {i < 3 ? <Bone style={s.checkCircle} /> : <Bone style={s.qtyBadge} />}
      </View>
    ))}
  </View>
);

// Qty box skeleton
export const PAQtyBoxSkeleton = () => (
  <View style={s.qtyBox}>
    <Bone style={s.qtyLabel} />
    <View style={{ alignItems: 'center', marginTop: 8 }}>
      <Bone style={s.qtyNum} />
      <Bone style={[s.qtyLabel, { marginTop: 8, width: 50 }]} />
    </View>
    <Bone style={s.qtyNote} />
  </View>
);

// Full task detail skeleton
export const PutAwayDetailSkeleton = () => (
  <>
    <PATopBarSkeleton />
    <View style={s.infoStrip}>
      {[80, 140, 80, 100].map((w, i) => (
        <View key={i} style={[s.infoRow, i === 3 && { borderBottomWidth: 0 }]}>
          <Bone style={{ width: w, height: 11 }} />
          <Bone style={{ width: 100, height: 11 }} />
        </View>
      ))}
    </View>
    <View style={s.section}>
      <Bone style={{ width: 80, height: 11 }} />
    </View>
    <PAProductListSkeleton count={5} />
  </>
);

// Full scan product skeleton
export const PutAwayScanProductSkeleton = () => (
  <>
    <PATopBarSkeleton />
    <Bone style={s.stepBar} />
    <Bone style={s.scanArea} />
    <Bone style={s.detailCard} />
  </>
);

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
  productRowDone: { opacity: 0.5 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  productName: { height: 13, width: '70%' },
  productSub: { height: 11, width: '50%' },
  qtyBadge: { width: 36, height: 24, borderRadius: 6 },
  checkCircle: { width: 22, height: 22, borderRadius: 11 },

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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
  },

  section: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 8 },

  qtyBox: {
    marginHorizontal: 14,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.g100,
  },
  qtyLabel: { width: 120, height: 11 },
  qtyNum: { width: 80, height: 50, borderRadius: 8 },
  qtyNote: { height: 60, borderRadius: 10, marginTop: 16 },

  stepBar: {
    marginHorizontal: 14,
    marginTop: 14,
    height: 50,
    borderRadius: 12,
  },
  scanArea: {
    marginHorizontal: 14,
    marginTop: 12,
    height: 260,
    borderRadius: 18,
  },
  detailCard: {
    marginHorizontal: 14,
    marginTop: 12,
    height: 140,
    borderRadius: 14,
  },
});
