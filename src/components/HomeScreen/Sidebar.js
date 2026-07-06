import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import Svg, { Path, Polyline, Line, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import Colors from '../../theme/colors';
import { useUser } from '../../context/UserContext';

const SIDEBAR_WIDTH = 260;
const CURVE_RADIUS = 28;

const HomeIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      stroke={Colors.blue}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="9 22 9 12 15 12 15 22"
      stroke={Colors.blue}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ProfileIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke={Colors.blue}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx="12"
      cy="7"
      r="4"
      stroke={Colors.blue}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const HamburgerIcon = () => (
  <Svg width={18} height={14} viewBox="0 0 18 14" fill="none">
    <Line
      x1="0"
      y1="1"
      x2="18"
      y2="1"
      stroke="rgba(255,255,255,0.85)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="0"
      y1="7"
      x2="18"
      y2="7"
      stroke="rgba(255,255,255,0.85)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="0"
      y1="13"
      x2="18"
      y2="13"
      stroke="rgba(255,255,255,0.85)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const HistoryIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      stroke={Colors.blue}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 3v5h5"
      stroke={Colors.blue}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 7v5l3 3"
      stroke={Colors.blue}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LogoutIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      stroke={Colors.red}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="16 17 21 12 16 7"
      stroke={Colors.red}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="21"
      y1="12"
      x2="9"
      y2="12"
      stroke={Colors.red}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Sidebar = ({ visible, onClose, onNavigate, onLogout }) => {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, overlayAnim]);

  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase()
    : 'NA';

  const appName = DeviceInfo.getApplicationName();
  const version = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  const handleLogoutPress = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: onLogout,
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.root]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {/* Dark overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
      </TouchableWithoutFeedback>

      {/* Sidebar panel — curved right edge */}
      <Animated.View
        style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 22 }]}>
          <View style={styles.blobTR} />
          <View style={styles.blobBL} />

          {/* Hamburger close button — aligns with HomeHeader hamburger */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.closeBtn}
          >
            <HamburgerIcon />
          </TouchableOpacity>

          {/* Avatar + user info row */}
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name || '---'}
              </Text>
              <Text style={styles.pickerId}>{user?.id || '--'}</Text>
            </View>
          </View>

          {/* Store pill */}
          <View style={styles.storePill}>
            <View style={styles.activeDot} />
            <Text style={styles.storeText} numberOfLines={1}>
              {user?.pharmacy_name || '---'}
            </Text>
          </View>
        </View>

        {/* Nav */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('home')}
          activeOpacity={0.65}
        >
          <HomeIcon />
          <Text style={styles.navLbl}>Home</Text>
        </TouchableOpacity>
        <View style={styles.navDivider} />
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('pastOrders')}
          activeOpacity={0.65}
        >
          <HistoryIcon />
          <Text style={styles.navLbl}>Past Orders</Text>
        </TouchableOpacity>
        <View style={styles.navDivider} />
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('profile')}
          activeOpacity={0.65}
        >
          <ProfileIcon />
          <Text style={styles.navLbl}>Profile</Text>
        </TouchableOpacity>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <TouchableOpacity
            style={styles.logoutRow}
            onPress={handleLogoutPress}
            activeOpacity={0.65}
          >
            <LogoutIcon />
            <Text style={styles.logoutLbl}>Log Out</Text>
          </TouchableOpacity>

          {/* Version — simple centered text */}
          <Text style={styles.versionText}>
            {appName} v{version} ({buildNumber})
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  root: {
    zIndex: 999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.52)',
  },

  // Panel with curved right edge
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: Colors.g50,
    borderTopRightRadius: CURVE_RADIUS,
    borderBottomRightRadius: CURVE_RADIUS,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 24,
    flexDirection: 'column',
  },

  // Header
  header: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  closeBtn: {
    marginBottom: 20,
    alignSelf: 'flex-start',
    padding: 4,
    zIndex: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    zIndex: 2,
  },
  userInfo: {
    flex: 1,
  },
  blobTR: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(9,146,211,0.18)',
    top: -55,
    right: -50,
  },
  blobBL: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -20,
    left: 30,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.22)',
    zIndex: 1,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    zIndex: 1,
  },
  pickerId: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 3,
    zIndex: 1,
    fontFamily: 'monospace',
  },
  storePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    zIndex: 1,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  storeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
    flexShrink: 1,
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  navDivider: {
    height: 1,
    backgroundColor: Colors.g100,
    marginHorizontal: 20,
  },
  navLbl: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.g900,
  },

  // Footer
  footer: {
    paddingBottom: 20,
  },
  footerDivider: {
    height: 1,
    backgroundColor: Colors.g100,
    marginHorizontal: 20,
    marginBottom: 4,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoutLbl: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.red,
  },

  // Simple centered version text
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.g500,
    fontWeight: '400',
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
});
