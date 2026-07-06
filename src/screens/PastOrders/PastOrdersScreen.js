import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Path, Polyline, Rect, Line } from 'react-native-svg';
import { BackIcon, CheckIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Toast from '../../utils/toast';
import { getPastOrders } from '../../api/orders';
import Routes from '../../navigation/routes';

// ─── Icons ────────────────────────────────────────────────────────────────────

const PickingIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 7L12 3L21 7V17L12 21L3 17V7Z"
      stroke={Colors.pk}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path
      d="M3 7L12 12L21 7"
      stroke={Colors.pk}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path
      d="M12 12V21"
      stroke={Colors.pk}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);

const PutAwayIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Polyline
      points="21 8 21 21 3 21 3 8"
      stroke={Colors.blue}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x="1"
      y="3"
      width="22"
      height="5"
      rx="1"
      stroke={Colors.blue}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Line
      x1="10"
      y1="12"
      x2="14"
      y2="12"
      stroke={Colors.blue}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = iso => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBox = ({ width, height, style }) => {
  const anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: 8, backgroundColor: Colors.g100 },
        { opacity: anim },
        style,
      ]}
    />
  );
};

const PastOrdersSkeleton = () => (
  <View>
    {/* Stats row skeleton */}
    <View style={s.statsRow}>
      {[0, 1, 2].map(i => (
        <View key={i} style={s.statCard}>
          <SkeletonBox width={32} height={16} style={{ marginBottom: 6 }} />
          <SkeletonBox width={48} height={10} />
        </View>
      ))}
    </View>
    {/* Card skeletons */}
    {[0, 1, 2, 3, 4].map(i => (
      <View key={i} style={[s.card, { marginBottom: 8, gap: 12 }]}>
        <SkeletonBox width={42} height={42} style={{ borderRadius: 12 }} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBox width={120} height={13} />
          <SkeletonBox width={160} height={11} />
          <SkeletonBox width={70} height={18} style={{ borderRadius: 5 }} />
        </View>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <SkeletonBox width={32} height={32} style={{ borderRadius: 16 }} />
          <SkeletonBox width={40} height={10} />
        </View>
      </View>
    ))}
  </View>
);

// ─── Order Card ───────────────────────────────────────────────────────────────

const OrderCard = ({ item, onPress }) => {
  const isPicking = item.type === 'picking';

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.78}>
      {/* Icon box */}
      <View style={[s.iconBox, isPicking ? s.iconBoxPk : s.iconBoxPa]}>
        {isPicking ? <PickingIcon /> : <PutAwayIcon />}
      </View>

      {/* Info */}
      <View style={s.info}>
        <Text style={s.orderId}>{item.id}</Text>
        <Text style={s.meta}>
          {formatDate(item.completed_at)} · {formatTime(item.completed_at)}
        </Text>
        <View style={s.badgeRow}>
          <View style={[s.typeBadge, isPicking ? s.typePk : s.typePa]}>
            <Text
              style={[
                s.typeBadgeText,
                { color: isPicking ? Colors.pk : Colors.blue },
              ]}
            >
              {isPicking ? 'Picking' : 'Put Away'}
            </Text>
          </View>
          <Text style={s.itemCount}>{item.items} items</Text>
        </View>
      </View>

      {/* Done checkmark */}
      <View style={s.doneCircle}>
        <CheckIcon color={Colors.green} size={14} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Stats Banner ─────────────────────────────────────────────────────────────

const StatsBanner = ({ totals }) => (
  <View style={s.statsRow}>
    <View style={s.statCard}>
      <Text style={s.statNum}>{totals.total}</Text>
      <Text style={s.statLbl}>Total</Text>
    </View>
    <View style={s.statCard}>
      <Text style={[s.statNum, { color: Colors.pk }]}>{totals.picking}</Text>
      <Text style={s.statLbl}>Picking</Text>
    </View>
    <View style={s.statCard}>
      <Text style={[s.statNum, { color: Colors.blue }]}>{totals.putaway}</Text>
      <Text style={s.statLbl}>Put Away</Text>
    </View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

const PastOrdersScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState([]);
  const [totals, setTotals] = useState({ total: 0, picking: 0, putaway: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async ({ refresh = false } = {}) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      const res = await getPastOrders();
      setOrders(res?.data || []);
      setTotals(res?.totals || { total: 0, picking: 0, putaway: 0 });
      setPage(1);
    } catch (err) {
      Toast.error(err?.message || 'Failed to load past orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
      fetchOrders();
    }, [fetchOrders]),
  );

  const visibleOrders = orders.slice(0, page * PAGE_SIZE);
  const hasMore = visibleOrders.length < orders.length;

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {/* Top bar */}
      <View style={[s.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <BackIcon color={Colors.g700} width={20} height={20} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>Past Orders</Text>
        <View style={{ width: 36 }} />
      </View>

      {loading ? (
        <FlatList
          data={[{ key: 'skeleton' }]}
          renderItem={() => <PastOrdersSkeleton />}
          keyExtractor={i => i.key}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.listContent}
        />
      ) : orders.length === 0 ? (
        <View style={s.emptyWrap}>
          <Text style={s.emptyTitle}>No past orders</Text>
          <Text style={s.emptySub}>Completed orders will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={visibleOrders}
          keyExtractor={item => item.id}
          ListHeaderComponent={<StatsBanner totals={totals} />}
          renderItem={({ item }) => (
            <OrderCard
              item={item}
              onPress={() =>
                navigation.navigate(Routes.PAST_ORDER_DETAIL, {
                  order: item,
                  taskId: item.task_id,
                })
              }
            />
          )}
          ListFooterComponent={
            hasMore ? (
              <TouchableOpacity
                style={s.loadMoreBtn}
                onPress={() => setPage(p => p + 1)}
                activeOpacity={0.75}
              >
                <Text style={s.loadMoreText}>Load More</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ height: 32 }} />
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchOrders({ refresh: true })}
              colors={[Colors.blue]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.listContent}
        />
      )}
    </View>
  );
};

export default PastOrdersScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.g50 },

  topBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  topBarTitle: { fontSize: 17, fontWeight: '700', color: Colors.g900 },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 14,
    marginTop: 16,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.g100,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statNum: { fontSize: 16, fontWeight: '700', color: Colors.g900 },
  statLbl: {
    fontSize: 11,
    color: Colors.g500,
    marginTop: 2,
    fontWeight: '500',
  },

  card: {
    marginHorizontal: 14,
    marginBottom: 8,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.g100,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconBoxPk: { backgroundColor: Colors.pkLight },
  iconBoxPa: { backgroundColor: Colors.blueLight },

  info: { flex: 1, minWidth: 0 },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.g900,
    fontFamily: 'monospace',
  },
  meta: { fontSize: 11, color: Colors.g500, marginTop: 3, marginBottom: 6 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  typePk: { backgroundColor: Colors.pkLight },
  typePa: { backgroundColor: Colors.blueLight },
  typeBadgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  itemCount: { fontSize: 11, color: Colors.g500, fontWeight: '500' },

  doneCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  loadMoreBtn: {
    marginHorizontal: 14,
    marginBottom: 32,
    marginTop: 4,
    paddingVertical: 13,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.g100,
    alignItems: 'center',
  },
  loadMoreText: { fontSize: 14, fontWeight: '600', color: Colors.blue },

  listContent: { flexGrow: 1, paddingBottom: 8 },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.g900,
    marginBottom: 8,
  },
  emptySub: { fontSize: 14, color: Colors.g500, textAlign: 'center' },
});
