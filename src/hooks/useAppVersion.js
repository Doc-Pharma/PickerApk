import { useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import { checkAppVersion } from '../api/app';

const useAppVersion = () => {
  const [checking, setChecking] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [currentVersion, setCurrentVersion] = useState('');
  const [currentBuildNo, setCurrentBuildNo] = useState('');

  useEffect(() => {
    setCurrentVersion(DeviceInfo.getVersion());
    setCurrentBuildNo(DeviceInfo.getBuildNumber());
  }, []);

  const checkUpdate = async () => {
    setChecking(true);
    try {
      // Backend response shape:
      // { update_required, is_force_update, latest_version_name,
      //   latest_version_code, update_title, update_message,
      //   features[], download_url, release_date }
      const res = await checkAppVersion();

      const needsUpdate = res?.data?.update_required ?? false;
      const isForce = res?.data?.is_force_update ?? false;

      setUpdateInfo(res?.data ?? null);
      setHasUpdate(needsUpdate);
      setForceUpdate(isForce);

      return { needsUpdate, forceUpdate: isForce, info: res?.data ?? null };
    } catch {
      // Fail silently — never block the user if the version check fails
      return { needsUpdate: false, forceUpdate: false, info: null };
    } finally {
      setChecking(false);
    }
  };

  return {
    checking,
    updateInfo,
    hasUpdate,
    forceUpdate,
    currentVersion,
    currentBuildNo,
    checkUpdate,
  };
};

export default useAppVersion;
