// src/components/HomeScreen/Skeleton.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';

// ─── Shimmer animated bone ────────────────────────────────────────────────────
const Bone = ({ style }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0.9],
  });

  return <Animated.View style={[s.bone, style, { opacity }]} />;
};

// ─── Header skeleton ──────────────────────────────────────────────────────────
const HeaderSkeleton = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.header, { paddingTop: insets.top + 16 }]}>
      <View>
        {/* Greeting line */}
        <Bone style={s.lineSmall} />
        {/* Name line */}
        <Bone style={s.lineLarge} />
        {/* Store chip */}
        <Bone style={s.chip} />
        {/* Status pill */}
        <Bone style={[s.lineSmall, { width: 80, marginTop: 8 }]} />
      </View>
      {/* Avatar */}
      <Bone style={s.avatar} />
    </View>
  );
};

// ─── Active card skeleton ─────────────────────────────────────────────────────
const CardSkeleton = ({ count = 2 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={s.card}>
        {/* Top row: id + badge */}
        <View style={s.cardTopRow}>
          <Bone style={s.cardId} />
          <Bone style={s.cardBadge} />
        </View>
        {/* Meta */}
        <Bone
          style={[s.lineSmall, { marginTop: 8, backgroundColor: '#ffffff30' }]}
        />
        {/* Progress track */}
        <Bone style={s.track} />
        {/* Prog label */}
        <Bone
          style={[
            s.lineSmall,
            { width: 120, backgroundColor: '#ffffff30', marginBottom: 14 },
          ]}
        />
        {/* Button */}
        <Bone style={s.cardBtn} />
      </View>
    ))}
  </>
);

// ─── Section label skeleton ───────────────────────────────────────────────────
const SectionLabelSkeleton = () => (
  <View style={s.sectionLabelWrap}>
    <Bone style={s.sectionLabel} />
  </View>
);

// ─── Pending task row skeleton ────────────────────────────────────────────────
const RowSkeleton = ({ count = 3 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={s.rowItem}>
        <Bone style={s.rowIcon} />
        <View style={{ flex: 1, gap: 6 }}>
          <Bone style={s.rowLine} />
          <Bone style={[s.rowLine, { width: '50%' }]} />
        </View>
        <Bone style={s.rowBadge} />
      </View>
    ))}
  </>
);

// ─── Main export ──────────────────────────────────────────────────────────────
const Skeleton = ({ type = 'home' }) => {
  if (type === 'header') return <HeaderSkeleton />;
  if (type === 'card') return <CardSkeleton />;
  if (type === 'row') return <RowSkeleton />;

  // default: full home page skeleton
  return (
    <>
      <HeaderSkeleton />
      <SectionLabelSkeleton />
      <CardSkeleton count={2} />
      <SectionLabelSkeleton />
      <RowSkeleton count={3} />
    </>
  );
};

export default Skeleton;

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  bone: {
    borderRadius: 6,
    backgroundColor: Colors.g300,
  },

  /* ── HEADER ── */
  header: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 20,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  lineSmall: {
    width: 80,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    marginBottom: 8,
  },

  lineLarge: {
    width: 180,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    marginBottom: 8,
  },

  chip: {
    width: 160,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    marginBottom: 8,
    marginTop: 2,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  /* ── SECTION LABEL ── */
  sectionLabelWrap: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionLabel: {
    width: 100,
    height: 11,
    borderRadius: 6,
  },

  /* ── ACTIVE CARD ── */
  card: {
    marginHorizontal: 14,
    marginBottom: 4,
    borderRadius: 18,
    padding: 18,
    backgroundColor: Colors.g300,
    overflow: 'hidden',
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  cardId: {
    width: 110,
    height: 16,
    backgroundColor: Colors.g100,
    borderRadius: 6,
  },

  cardBadge: {
    width: 70,
    height: 24,
    backgroundColor: Colors.g100,
    borderRadius: 20,
  },

  track: {
    width: '100%',
    height: 5,
    backgroundColor: Colors.g100,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 5,
  },

  cardBtn: {
    width: '100%',
    height: 44,
    backgroundColor: Colors.g100,
    borderRadius: 10,
  },

  /* ── PENDING ROW ── */
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginBottom: 8,
    padding: 14,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.g100,
    gap: 11,
  },

  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
  },

  rowLine: {
    height: 12,
    borderRadius: 6,
    width: '75%',
  },

  rowBadge: {
    width: 60,
    height: 22,
    borderRadius: 6,
  },
});
