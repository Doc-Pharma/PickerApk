import DeviceInfo from 'react-native-device-info';
import { request } from '../client';

export const sendOTP = phone => request('POST', '/auth/login', { phone });

export const verifyOTP = async (phone, otp) => {
  const deviceId = await DeviceInfo.getUniqueId();
  return request('POST', '/auth/verify-otp', {
    phone,
    otp,
    device_id: deviceId,
  });
};

export const getProfile = () => request('GET', '/picker-user/profile');

export const logout = () => request('POST', '/auth/logout');
