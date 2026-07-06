// src/context/Context.js
import { createContext } from 'react';

export const DimensionsContext = createContext({
  width: 0,
  height: 0,
  isSmallPhone: false,
  isShortPhone: false,
  isTablet: false,
});
