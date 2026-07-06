import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { BackIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Toast from '../../utils/toast';
import { useUser } from '../../context/UserContext';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonBox = ({ width, height, radius = 8, style }) => {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: Colors.g100 },
        { opacity: pulse },
        style,
      ]}
    />
  );
};

const ProfileSkeleton = ({ insets }) => (
  <View style={sk.root}>
    {/* Top bar */}
    <View style={[sk.topBar, { paddingTop: insets.top + 10 }]}>
      <SkeletonBox width={36} height={36} radius={10} />
      <SkeletonBox width={80} height={18} />
      <View style={{ width: 36 }} />
    </View>

    {/* Profile card */}
    <View style={sk.card}>
      <SkeletonBox
        width={80}
        height={80}
        radius={40}
        style={{ alignSelf: 'center', marginBottom: 14 }}
      />
      <SkeletonBox
        width={160}
        height={18}
        radius={8}
        style={{ alignSelf: 'center', marginBottom: 10 }}
      />
      <SkeletonBox
        width={90}
        height={28}
        radius={20}
        style={{ alignSelf: 'center' }}
      />
    </View>

    {/* Info card */}
    <View style={sk.infoCard}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={sk.infoRow}>
          <SkeletonBox width={80} height={13} />
          <SkeletonBox width={120} height={13} />
        </View>
      ))}
    </View>
  </View>
);

const sk = StyleSheet.create({
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
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.g100,
    padding: 24,
  },
  infoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
  },
});

//  Avatar
const Avatar = ({ name }) => {
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase()
    : 'NA';
  return (
    <View style={s.avatarLarge}>
      <Text style={s.avatarText}>{initials}</Text>
    </View>
  );
};

//  Info row
const InfoRow = ({ label, value, valueStyle, last = false }) => (
  <View style={[s.infoRow, last && { borderBottomWidth: 0 }]}>
    <Text style={s.infoLabel}>{label}</Text>
    <Text style={[s.infoValue, valueStyle]} numberOfLines={1}>
      {value || '---'}
    </Text>
  </View>
);

//  Screen
const ProfileScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  const { user, setAuth } = useUser();

  const [logoutLoading, setLogoutLoading] = React.useState(false);
  const [ready, setReady] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  // App version info from device
  const appName = DeviceInfo.getApplicationName();
  const version = DeviceInfo.getVersion();
  const buildNo = DeviceInfo.getBuildNumber();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);

      setReady(false);
      fadeAnim.setValue(0);
      slideAnim.setValue(24);

      const t = setTimeout(() => {
        setReady(true);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
          }),
        ]).start();
      }, 550);

      return () => clearTimeout(t);
    }, []),
  );

  if (!ready) return <ProfileSkeleton insets={insets} />;

  const isActive = user?.status?.toLowerCase() === 'active';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            setLogoutLoading(true);

            Toast.info('Logged out successfully');

            setTimeout(() => {
              setAuth(null);
            }, 1200);
          } catch {
          } finally {
            setLogoutLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={[s.root, { paddingBottom: insets.bottom }]}>
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
        <Text style={s.topBarTitle}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header card */}
        <Animated.View
          style={[
            s.profileCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Avatar name={user?.name} />
          <Text style={s.profileName}>
            {user?.name ? `${user.name} (${user.id || '--'})` : '---'}
          </Text>

          <View
            style={[s.statusPill, isActive ? s.statusActive : s.statusInactive]}
          >
            <View
              style={[s.statusDot, isActive ? s.dotActive : s.dotInactive]}
            />
            <Text
              style={[
                s.statusText,
                isActive ? s.statusTextActive : s.statusTextInactive,
              ]}
            >
              {user?.status || 'Inactive'}
            </Text>
          </View>
        </Animated.View>

        {/* User info card */}
        <Animated.View
          style={[
            s.infoCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <InfoRow label="Full Name" value={user?.name} />
          <InfoRow
            label="Phone"
            value={user?.phone ? `+91 ${user.phone}` : null}
          />
          <InfoRow
            label="Pharmacy"
            value={
              user?.pharmacy_name
                ? `${user.pharmacy_name} (${user.pharmacy_id})`
                : '---'
            }
          />
          <InfoRow
            label="Status"
            value={user?.status}
            valueStyle={{ color: isActive ? Colors.green : Colors.g500 }}
            last
          />
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* App version */}
      <Text style={s.versionText}>
        {appName} · v{version} ({buildNo})
      </Text>

      {/* Logout button */}
      <View style={[s.footer, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          style={s.logoutBtn}
          onPress={handleLogout}
          disabled={logoutLoading}
          activeOpacity={0.85}
        >
          <Text style={s.logoutText}>
            {logoutLoading ? 'Logging out…' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

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
  versionText: {
    fontSize: 12,
    color: Colors.g700,
    textAlign: 'center',
    paddingVertical: 12,
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  profileCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.g100,
    padding: 24,
    alignItems: 'center',
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: Colors.blueLight,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: Colors.white },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.g900,
    marginBottom: 4,
  },
  profileCode: {
    fontSize: 14,
    color: Colors.g500,
    fontFamily: 'monospace',
    marginBottom: 14,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusActive: {
    backgroundColor: Colors.greenLight,
    borderColor: 'rgba(13,122,78,0.2)',
  },
  statusInactive: { backgroundColor: Colors.g100, borderColor: Colors.g300 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  dotActive: { backgroundColor: Colors.green },
  dotInactive: { backgroundColor: Colors.g300 },
  statusText: { fontSize: 13, fontWeight: '600' },
  statusTextActive: { color: Colors.green },
  statusTextInactive: { color: Colors.g500 },

  infoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.g500,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingTop: 14,
    paddingBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g50,
  },
  infoLabel: { fontSize: 14, color: Colors.g500, fontWeight: '500' },
  infoValue: {
    fontSize: 14,
    color: Colors.g900,
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },

  // Update row
  updateRow: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.g100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  updateRowText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blue,
  },
  updateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
    marginRight: 8,
  },
  updateRowChevron: { fontSize: 20, color: Colors.g300 },

  footer: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.g100,
  },
  logoutBtn: {
    width: '100%',
    backgroundColor: Colors.redLight,
    borderWidth: 1,
    borderColor: 'rgba(192,73,10,0.2)',
    borderRadius: 13,
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.red },
});
