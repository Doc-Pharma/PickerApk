import { io } from 'socket.io-client';
import crashlytics from '@react-native-firebase/crashlytics';

let _socket = null;

const socketService = {
  connect(token, baseUrl) {
    try {
      if (_socket?.connected) return;
      _socket = io(baseUrl, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });
    } catch (error) {
      crashlytics().recordError(error);
    }
  },

  disconnect() {
    try {
      if (_socket) {
        _socket.disconnect();
        _socket = null;
      }
    } catch (error) {
      crashlytics().recordError(error);
    }
  },

  on(event, handler) {
    try {
      _socket?.on(event, handler);
    } catch (error) {
      crashlytics().recordError(error);
    }
  },

  off(event, handler) {
    try {
      _socket?.off(event, handler);
    } catch (error) {
      crashlytics().recordError(error);
    }
  },

  get isConnected() {
    try {
      return _socket?.connected ?? false;
    } catch {
      return false;
    }
  },
};

export default socketService;
