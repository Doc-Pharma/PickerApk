import React, { useRef } from 'react';
import {
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../theme/colors';
import { CheckIcon, AlertIcon } from '../../assets/Icons';

const UpdateScreen = ({ route, onSkip }) => {
  const insets = useSafeAreaInsets();
  const { updateInfo, currentVersion, currentBuildNo, forceUpdate } =
    route?.params || {};

  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleUpdate = async () => {
    const url = updateInfo?.download_url;
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch {}
  };

  const features = Array.isArray(updateInfo?.features)
    ? updateInfo.features
    : [];

  return (
    <View
      style={[
        s.root,
        { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <Animated.View
          style={[s.iconWrap, { transform: [{ scale: scaleAnim }] }]}
        >
          <Text style={s.iconEmoji}>🚀</Text>
        </Animated.View>

        {/* Header */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={s.title}>
            {updateInfo?.update_title || 'New Update Available'}
          </Text>
          <Text style={s.subtitle}>
            {updateInfo?.update_message ||
              'A new version of DocPharma Picker is ready to install.'}
          </Text>
        </Animated.View>

        {/* Version comparison */}
        <View style={s.versionCard}>
          <View style={s.versionRow}>
            <Text style={s.versionLabel}>Current Version</Text>
            <View style={s.badge}>
              <Text style={s.badgeText}>
                v{currentVersion} ({currentBuildNo})
              </Text>
            </View>
          </View>

          <View style={[s.versionRow, s.versionRowLast]}>
            <Text style={s.versionLabel}>New Version</Text>
            <View style={[s.badge, s.badgeNew]}>
              <Text style={[s.badgeText, s.badgeTextNew]}>
                v{updateInfo?.latest_version_name} (
                {updateInfo?.latest_version_code})
              </Text>
            </View>
          </View>
        </View>

        {/* Force update warning */}
        {forceUpdate && (
          <View style={s.forceWarn}>
            <AlertIcon
              width={16}
              height={16}
              color={Colors.red}
              strokeWidth={2}
            />
            <Text style={s.forceWarnText}>
              This update is required to continue using the app.
            </Text>
          </View>
        )}

        {/* What's new */}
        {features.length > 0 && (
          <View style={s.featuresCard}>
            <Text style={s.featuresTitle}>What's New</Text>
            {features.map((item, i) => (
              <View key={i} style={s.featureRow}>
                <View style={s.featureDot}>
                  <CheckIcon
                    width={10}
                    height={10}
                    color={Colors.blue}
                    strokeWidth={3}
                  />
                </View>
                <Text style={s.featureText}>{item}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Buttons */}
      <View style={s.footer}>
        <TouchableOpacity
          style={s.updateBtn}
          onPress={handleUpdate}
          activeOpacity={0.85}
        >
          <Text style={s.updateBtnText}>Update Now</Text>
        </TouchableOpacity>

        {!forceUpdate && onSkip && (
          <TouchableOpacity
            style={s.skipBtn}
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={s.skipText}>Maybe Later</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default UpdateScreen;

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },

  scroll: {
    alignItems: 'center',
    paddingBottom: 16,
  },

  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: Colors.blueLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconEmoji: { fontSize: 44 },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.g900,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.g500,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
    paddingHorizontal: 8,
  },

  // Version card
  versionCard: {
    width: '100%',
    backgroundColor: Colors.g50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.g100,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g100,
  },
  versionRowLast: { borderBottomWidth: 0 },
  versionLabel: { fontSize: 13, color: Colors.g500, fontWeight: '500' },

  badge: {
    backgroundColor: Colors.g100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeNew: { backgroundColor: Colors.greenLight },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.g700,
  },
  badgeTextNew: { color: Colors.green },

  // Force update warning
  forceWarn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.redLight,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(192,73,10,0.15)',
    marginBottom: 14,
  },
  forceWarnText: {
    flex: 1,
    fontSize: 13,
    color: Colors.red,
    fontWeight: '500',
    lineHeight: 19,
  },

  // Features
  featuresCard: {
    width: '100%',
    backgroundColor: Colors.blueLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(27,95,168,0.12)',
    gap: 10,
  },
  featuresTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.blue,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    color: Colors.g700,
    lineHeight: 20,
  },

  // Footer buttons
  footer: {
    paddingTop: 16,
    gap: 10,
  },
  updateBtn: {
    width: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  updateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  skipBtn: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    color: Colors.g500,
    fontWeight: '500',
  },
});
