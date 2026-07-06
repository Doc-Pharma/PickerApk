// src/screens/PutAway/PutAwayCompleteScreen.js
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Button } from '../../components';
import { CheckIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import * as paApi from '../../api/putaway';
import useApi from '../../hooks/useApi';

const StatBox = ({ value, label }) => (
  <View style={s.statBox}>
    <Text style={s.statVal}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

const PutAwayCompleteScreen = ({ navigation, route }) => {
  const { taskId, itemId } = route?.params || {};
  const scale = useRef(new Animated.Value(0)).current;
  const { execute: doComplete } = useApi(paApi.markTaskComplete);
  const [taskStats, setTaskStats] = useState({ itemsPlaced: 0 });

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor(Colors.navy);
      // Disable hardware back — only "Back to Home" allowed
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, []),
  );

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 7,
    }).start();

    if (taskId) {
      paApi
        .getPutAwayTask(taskId)
        .then(res => {
          const items = res?.data?.items || [];
          setTaskStats({ itemsPlaced: items.length });
        })
        .catch(() => {});
    }
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });

  const goHome = () =>
    navigation.reset({ index: 0, routes: [{ name: Routes.HOME }] });

  return (
    <View style={s.safe}>
      <View style={s.content}>
        {/* Animated checkmark ring — matches .cc-icon */}
        <Animated.View style={[s.iconRing, { transform: [{ scale }] }]}>
          <CheckIcon color={Colors.green} size={38} />
        </Animated.View>

        <Text style={s.title}>Put Away Complete</Text>
        <Text style={s.subtitle}>
          All items in {taskId} placed and confirmed. Inventory updated.
        </Text>

        {/* Stats grid — matches .cc-grid */}
        <View style={s.grid}>
          <StatBox value={taskStats.itemsPlaced} label="Items Placed" />
          <StatBox value="1" label="Invoice" />
          <StatBox value={dateStr} label="Date" />
          <StatBox value={timeStr} label="Completed" />
        </View>

        <Button title="Back to Home" variant="white" onPress={goHome} />
      </View>
    </View>
  );
};

export default PutAwayCompleteScreen;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.navy },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  iconRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(13,122,78,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(13,122,78,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'monospace',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
