// src/context/DimensionsProvider.js
import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { DimensionsContext } from './Context';

export function DimensionsProvider({ children }) {
  const { width, height } = useWindowDimensions();

  const value = useMemo(
    () => ({
      width,
      height,
      isSmallPhone: width < 350,
      isShortPhone: height < 700,
      isTablet: width >= 768,
    }),
    [width, height],
  );

  return (
    <DimensionsContext.Provider value={value}>
      {children}
    </DimensionsContext.Provider>
  );
}
