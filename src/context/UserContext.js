import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLogoutHandler, setAuthToken, clearAuthToken } from '../api/client';
import Toast from '../utils/toast';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [auth, setAuthState] = useState(null); // { token, user }
  const [loading, setLoading] = useState(true);

  // Wrapper to keep everything synced
  const setAuth = newAuth => {
    if (newAuth?.token) {
      setAuthToken(newAuth.token);
      setAuthState({
        token: newAuth.token,
        user: newAuth.user ?? null,
      });
    } else {
      clearAuthToken();
      setAuthState(null);
    }
  };

  // Update only user while keeping token
  const setUser = newUser => {
    setAuthState(prev => {
      if (!prev?.token) return null;
      return { ...prev, user: newUser };
    });
  };

  // Load on app start
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const saved = await AsyncStorage.getItem('auth');

        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.token) {
            setAuthToken(parsed.token);
            setAuthState(parsed);
          }
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  // Save / Remove
  useEffect(() => {
    const saveAuth = async () => {
      try {
        if (auth?.token) {
          await AsyncStorage.setItem('auth', JSON.stringify(auth));
        } else {
          await AsyncStorage.removeItem('auth');
        }
      } catch (e) {}
    };

    saveAuth();
  }, [auth]);

  // Global logout (from axios 401)
  useEffect(() => {
    setLogoutHandler((reason, message) => {
      if (reason === 'SESSION_EXPIRED') {
        Toast.error(message || 'Session expired. Please login again.');
        setTimeout(() => setAuth(null), 1500);
      } else {
        setAuth(null);
      }
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        auth,
        user: auth?.user ?? null,
        token: auth?.token ?? null,
        setAuth,
        setUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
