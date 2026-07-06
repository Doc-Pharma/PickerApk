import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import socketService from '../services/socketService';
import { useUser } from './UserContext';
import { ENV } from '../config/env';

const SocketContext = createContext({ isConnected: false, on: () => () => {} });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { auth } = useUser();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!auth?.token) {
      try {
        socketService.disconnect();
        setIsConnected(false);
      } catch (error) {
        crashlytics().recordError(error);
      }
      return;
    }

    try {
      socketService.connect(auth.token, ENV.API_URL);
    } catch (error) {
      crashlytics().recordError(error);
    }

    try {
      socketService.on('connect', () => {
        try {
          setIsConnected(true);
        } catch (e) {
          crashlytics().recordError(e);
        }
      });
    } catch (error) {
      crashlytics().recordError(error);
    }

    try {
      socketService.on('disconnect', () => {
        try {
          setIsConnected(false);
        } catch (e) {
          crashlytics().recordError(e);
        }
      });
    } catch (error) {
      crashlytics().recordError(error);
    }

    try {
      socketService.on('connect_error', err => {
        try {
          crashlytics().log(`Socket connect_error: ${err?.message}`);
          setIsConnected(false);
        } catch (e) {
          crashlytics().recordError(e);
        }
      });
    } catch (error) {
      crashlytics().recordError(error);
    }

    return () => {
      try {
        socketService.disconnect();
        setIsConnected(false);
      } catch (error) {
        crashlytics().recordError(error);
      }
    };
  }, [auth?.token]);

  const on = useCallback((event, handler) => {
    try {
      socketService.on(event, handler);
    } catch (error) {
      crashlytics().recordError(error);
    }
    return () => {
      try {
        socketService.off(event, handler);
      } catch (error) {
        crashlytics().recordError(error);
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, on }}>
      {children}
    </SocketContext.Provider>
  );
};
