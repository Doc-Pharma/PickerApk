import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BellIcon,
  CameraIcon,
  CloseIcon,
  SettingsGearIcon,
} from '../../assets/Icons';
import Colors from '../../theme/colors';

const PermissionBlock = ({ title, icon, description, granted }) => (
  <View style={[styles.card, !granted && styles.cardDenied]}>
    <View
      style={[
        styles.iconWrap,
        granted ? styles.iconGranted : styles.iconDenied,
      ]}
    >
      {icon}
    </View>
    <View style={styles.cardBody}>
      <View style={styles.cardRow}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text
          style={[
            styles.cardStatus,
            granted ? styles.statusGranted : styles.statusPending,
          ]}
        >
          {granted ? 'Granted' : 'Pending'}
        </Text>
      </View>
      <Text style={styles.cardDesc}>{description}</Text>
    </View>
  </View>
);

export default function PermissionScreen({
  isCameraGranted,
  isNotificationGranted,
  onRetry,
}) {
  const insets = useSafeAreaInsets();

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {}
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.crossWrap}>
          <CloseIcon width={30} height={30} color="#df605f" strokeWidth={2.5} />
        </View>
        <Text style={styles.headerTitle}>Permissions Required</Text>
        <Text style={styles.headerSub}>
          Grant the following permissions to continue using the app
        </Text>
      </View>

      <View style={styles.blocks}>
        <PermissionBlock
          title="Notifications"
          icon={
            <BellIcon
              width={20}
              height={20}
              color={isNotificationGranted ? '#7cc487' : '#e26e6c'}
              strokeWidth={2}
            />
          }
          description="Required to receive order alerts, updates and support messages."
          granted={isNotificationGranted}
        />

        <PermissionBlock
          title="Camera"
          icon={
            <CameraIcon
              width={20}
              height={20}
              color={isCameraGranted ? '#7cc487' : '#e26e6c'}
              strokeWidth={2}
            />
          }
          description="Required for scanning QR codes and barcodes during picking tasks."
          granted={isCameraGranted}
        />
      </View>

      <Pressable style={styles.retryBtn} onPress={onRetry}>
        <Text style={styles.retryText}>Try Again</Text>
      </Pressable>

      <Pressable style={styles.settingsBtn} onPress={openSettings}>
        <SettingsGearIcon
          width={18}
          height={18}
          color={Colors.blue}
          strokeWidth={2}
        />
        <Text style={styles.settingsText}>Open App Settings</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 80,
    paddingHorizontal: 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },

  crossWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fae3e2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.g900,
    marginBottom: 8,
  },

  headerSub: {
    fontSize: 13,
    color: Colors.g500,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  blocks: {
    gap: 14,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },

  cardDenied: {
    backgroundColor: '#fcf4f3',
    borderColor: '#fceae8',
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  iconGranted: { backgroundColor: '#e2fbe8' },
  iconDenied: { backgroundColor: '#fae3e2' },

  cardBody: { flex: 1, gap: 6 },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.g900,
  },

  cardStatus: { fontSize: 12, fontWeight: '400' },
  statusGranted: { color: '#bad4bf' },
  statusPending: { color: '#dda7a6' },

  cardDesc: {
    fontSize: 12,
    color: Colors.g500,
    lineHeight: 18,
  },

  retryBtn: {
    marginTop: 32,
    backgroundColor: Colors.blue,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },

  retryText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },

  settingsBtn: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.blue,
  },

  settingsText: {
    color: Colors.blue,
    fontSize: 14,
    fontWeight: '500',
  },
});
