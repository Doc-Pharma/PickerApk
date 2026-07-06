// src/screens/Home/HomeScreen.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import HomeHeader from '../../components/HomeScreen/HomeHeader';
import Sidebar from '../../components/HomeScreen/Sidebar';
import ActiveTaskCard from '../../components/HomeScreen/ActiveTaskCard';
import TaskRow from '../../components/HomeScreen/TaskRow';
import SectionLabel from '../../components/HomeScreen/SectionLabel';
import Skeleton from '../../components/HomeScreen/Skeleton';
import Colors from '../../theme/colors';
import { getTasks } from '../../api/home';
import Routes from '../../navigation/routes';
import Toast from '../../utils/toast';
import { useUser } from '../../context/UserContext';
import { getProfile } from '../../api/auth';
import { useSocket } from '../../context/SocketContext';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({ active: [], pending: [] });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const backPressedOnce = useRef(false);

  const { setUser, setAuth } = useUser();
  const { on } = useSocket();

  // Load profile once on mount and store in UserContext
  // HomeHeader and Sidebar read directly from context — no prop drilling
  useEffect(() => {
    getProfile()
      .then(profileRes => {
        if (profileRes?.data) setUser(profileRes.data);
      })
      .catch(() => {});
  }, []);

  const handleSidebarNavigate = dest => {
    setSidebarOpen(false);
    if (dest === 'profile') {
      setTimeout(() => navigation.navigate(Routes.PROFILE), 260);
    } else if (dest === 'pastOrders') {
      setTimeout(() => navigation.navigate(Routes.PAST_ORDERS), 260);
    }
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    setTimeout(() => setAuth(null), 260);
  };

  const fetchHome = useCallback(async ({ refresh = false } = {}) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      const res = await getTasks();
      setData({
        active: res?.data?.active || [],
        pending: res?.data?.pending || [],
      });
    } catch (err) {
      Toast.error(err?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ── Real-time socket events ───────────────────────────────────────────────
  // Backend emits 'order:updated' with { order_id, order_number } as a signal
  // to re-fetch — no targeted state surgery needed.
  useEffect(() => {
    let offOrderUpdated = () => {};

    try {
      offOrderUpdated = on('order:updated', ({ order_number } = {}) => {
        try {
          Toast.info(
            order_number
              ? `Order ${order_number} updated`
              : 'New order update received',
          );
          fetchHome();
        } catch (e) {
          // socket handler error — silenced
        }
      });
    } catch (e) {
      // socket subscribe error — silenced
    }

    return () => {
      try {
        offOrderUpdated();
      } catch (_) {}
    };
  }, [on, fetchHome]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor(Colors.navy);
      fetchHome();

      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (backPressedOnce.current) {
          BackHandler.exitApp();
          return true;
        }
        backPressedOnce.current = true;
        Toast.info('Press back again to exit');
        setTimeout(() => {
          backPressedOnce.current = false;
        }, 3000);
        return true;
      });

      return () => {
        sub.remove();
        backPressedOnce.current = false;
      };
    }, [fetchHome]),
  );

  const onRefresh = () => fetchHome({ refresh: true });

  const navigate = item => {
    const type = item.type;
    if (type === 'picking' || type === 'packing') {
      navigation?.navigate(Routes.PICKING_ORDER_DETAIL, {
        taskId: item.task_id ?? item.id,
      });
    } else {
      navigation?.navigate(Routes.PUT_AWAY_DETAIL, {
        taskId: item.task_id ?? item.id,
      });
    }
  };

  //  Skeleton
  if (loading) {
    return (
      <View style={s.skeletonRoot}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.navy}
          translucent={false}
        />
        <Skeleton type="home" />
      </View>
    );
  }

  //  FlatList data array — mixes section headers + cards + rows ─────────────
  const listData = [
    { _type: 'ACTIVE_HEADER' },
    ...data.active.map(item => ({ ...item, _type: 'ACTIVE_CARD' })),
    { _type: 'PENDING_HEADER' },
    ...data.pending.map(item => ({ ...item, _type: 'PENDING_ROW' })),
    { _type: 'SPACER' },
  ];

  const renderItem = ({ item }) => {
    switch (item._type) {
      case 'ACTIVE_HEADER':
        return <SectionLabel label="Active Tasks" />;
      case 'PENDING_HEADER':
        return <SectionLabel label="Pending Tasks" />;
      case 'ACTIVE_CARD':
        return <ActiveTaskCard item={item} onPress={() => navigate(item)} />;
      case 'PENDING_ROW':
        return <TaskRow item={item} onPress={() => navigate(item)} />;
      case 'SPACER':
        return <View style={{ height: 32 }} />;
      default:
        return null;
    }
  };

  //  Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      {/*
        translucent=false → content does NOT go behind status bar.
        HomeHeader uses useSafeAreaInsets internally to push content below it.
      */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.navy}
        translucent={false}
      />

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, i) => item._type + (item.id || '') + i}
        ListHeaderComponent={
          <HomeHeader onMenuPress={() => setSidebarOpen(true)} />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.white}
            colors={[Colors.blue, Colors.pk]}
            progressBackgroundColor={Colors.navy}
          />
        }
        showsVerticalScrollIndicator={false}
        style={s.list}
        contentContainerStyle={s.listContent}
      />

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleSidebarNavigate}
        onLogout={handleLogout}
      />
    </View>
  );
};

export default HomeScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.g50 },
  skeletonRoot: { flex: 1, backgroundColor: Colors.navy },
  list: { flex: 1 },
  listContent: { flexGrow: 1, backgroundColor: Colors.g50 },
});
