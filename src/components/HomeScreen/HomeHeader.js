import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Line, Rect } from 'react-native-svg';
import { StoreIcon, HandWaveIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import { useUser } from '../../context/UserContext';

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

// renders the qr code scan icon used in the ui
const QrScanIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    {/* Top-left */}
    <Path d="M3 3H9V9H3V3Z" stroke={Colors.white} strokeWidth="1.8" />
    <Path d="M5 5H7V7H5V5Z" fill={Colors.white} />

    {/* Top-right */}
    <Path d="M15 3H21V9H15V3Z" stroke={Colors.white} strokeWidth="1.8" />
    <Path d="M17 5H19V7H17V5Z" fill={Colors.white} />

    {/* Bottom-left */}
    <Path d="M3 15H9V21H3V15Z" stroke={Colors.white} strokeWidth="1.8" />
    <Path d="M5 17H7V19H5V17Z" fill={Colors.white} />

    {/* Bottom-right */}
    <Rect x="15" y="15" width="3" height="3" fill={Colors.white} />
    <Rect x="19" y="15" width="2" height="2" fill={Colors.white} />
    <Rect x="15" y="19" width="2" height="2" fill={Colors.white} />
    <Rect x="19" y="19" width="3" height="2" fill={Colors.white} />
  </Svg>
);

const HomeHeader = ({ onMenuPress, onScanQRPress }) => {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const statusStr = String(user?.status ?? '').toLowerCase();
  const isActive =
    statusStr === 'active' || statusStr === '1' || statusStr === 'true';

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Decorative blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      {/* Status badge — top right */}
      <View style={[styles.statusBadge, { top: insets.top + 12 }]}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isActive ? '#4ADE80' : Colors.g300 },
          ]}
        />
        <Text style={styles.statusBadgeText}>
          {isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>

      {/* Scan qr  below Active Status */}
      <TouchableOpacity
        style={[styles.scanQrButton, { top: insets.top + 64 }]}
        onPress={onScanQRPress}
        activeOpacity={0.8}
      >
        <View style={styles.scanQrContainer}>
          <QrScanIcon />
        </View>
        <Text style={styles.scanQrText}>Scan QR</Text>
      </TouchableOpacity>

      <View style={styles.contentRow}>
        {/* Hamburger button */}
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={onMenuPress}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <HamburgerIcon />
        </TouchableOpacity>

        {/* Text */}
        <View style={styles.textCol}>
          <View style={styles.greetRow}>
            <Text style={styles.greet}>Hello</Text>
            <HandWaveIcon width={16} height={16} color="#fff" />
          </View>

          <Text style={styles.name} numberOfLines={1}>
            {user?.name || '---'}{' '}
            <Text style={styles.nameCode}>({user?.id || '--'})</Text>
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.chip}>
              <StoreIcon
                width={13}
                height={13}
                color="rgba(255,255,255,0.65)"
              />
              <Text style={styles.chipText} numberOfLines={1}>
                {user?.pharmacy_name
                  ? `${user.pharmacy_name} (${user.pharmacy_id || '--'})`
                  : '---'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.navy,
    paddingHorizontal: 20,
    paddingBottom: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  blobTopRight: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(9,146,211,0.2)',
    top: -60,
    right: -60,
  },
  blobBottomLeft: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -30,
    left: 40,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    zIndex: 1,
  },
  menuBtn: {
    marginTop: 6,
    padding: 4,
    borderRadius: 8,
  },
  textCol: { flex: 1, paddingRight: 90 },
  greetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  greet: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  name: { fontSize: 23, fontWeight: '700', color: Colors.white },
  nameCode: { fontSize: 18, fontWeight: '500', color: 'rgba(255,255,255,0.7)' },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    flexShrink: 1,
  },
  statusBadge: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    zIndex: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },

  scanQrButton: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  scanQrText: {
    marginTop: 3,
    fontSize: 11,
    color: Colors.white,
    fontWeight: '600',
  },

  scanQrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
});
