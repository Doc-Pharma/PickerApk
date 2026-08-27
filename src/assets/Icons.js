import React from 'react';
import Svg, {
  Path,
  Line,
  Polyline,
  Rect,
  Circle,
  Polygon,
} from 'react-native-svg';

//  Bell / Notification
export const BellIcon = ({
  width = 20,
  height = 20,
  color = '#374151',
  strokeWidth = 2,
  size,
}) => (
  <Svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.73 21a2 2 0 0 1-3.46 0"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

//  Settings Gear
export const SettingsGearIcon = ({
  width = 20,
  height = 20,
  color = '#374151',
  strokeWidth = 2,
  size,
}) => (
  <Svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

//  Picking / Box 3D
export const PickingIcon = ({
  width = 20,
  height = 20,
  color = '#C05621',
  strokeWidth = 1.8,
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 7L12 3L21 7V17L12 21L3 17V7Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M3 7L12 12L21 7"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M12 12V21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

//  Put Away / Box with arrow
export const PutAwayIcon = ({
  width = 20,
  height = 20,
  color = '#1B5FA8',
  strokeWidth = 1.8,
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Polyline
      points="21 8 21 21 3 21 3 8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x="1"
      y="3"
      width="22"
      height="5"
      rx="1"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Line
      x1="10"
      y1="12"
      x2="14"
      y2="12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

//  Chevron Right
export const ChevronRightIcon = ({
  width = 20,
  height = 20,
  color = '#D1D5DB',
  strokeWidth = 2,
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 6L15 12L9 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

//  Back / Arrow Left
export const BackIcon = ({
  width = 22,
  height = 22,
  color = '#374151',
  strokeWidth = 2.2,
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ArrowLeft alias (same as Back)
export const ArrowLeftIcon = BackIcon;

//  Store
export const StoreIcon = ({
  width = 16,
  height = 16,
  color = 'rgba(255,255,255,0.65)',
  strokeWidth = 1.5,
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10H21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M5 10V19H19V10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <Path
      d="M3 10L5 5H19L21 10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

//  Hand Wave
export const HandWaveIcon = ({
  width = 18,
  height = 18,
  color = '#fff',
  strokeWidth = 1.5,
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 11V5C7 4.44772 7.44772 4 8 4C8.55228 4 9 4.44772 9 5V11"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M9 11V4C9 3.44772 9.44772 3 10 3C10.5523 3 11 3.44772 11 4V11"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M11 11V5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V11"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M13 11V6C13 5.44772 13.4477 5 14 5C14.5523 5 15 5.44772 15 6V12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M7 11C7 11 6 11 6 12C6 15 8 18 12 18C16 18 18 15 18 12V10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

//  Check / Tick
export const CheckIcon = ({
  width = 20,
  height = 20,
  color = '#0D7A4E',
  strokeWidth = 2.5,
  size,
}) => (
  <Svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M20 6 9 17l-5-5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

//  Alert / Warning
export const AlertIcon = ({
  width = 20,
  height = 20,
  color = '#C0490A',
  strokeWidth = 2,
  size,
}) => (
  <Svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="12"
      y1="9"
      x2="12"
      y2="13"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line
      x1="12"
      y1="17"
      x2="12.01"
      y2="17"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  </Svg>
);

//  Camera
export const CameraIcon = ({
  width = 24,
  height = 24,
  color = '#FFFFFF',
  strokeWidth = 2,
  size,
}) => (
  <Svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

//  Flash / Torch
export const FlashIcon = ({
  width = 20,
  height = 20,
  color = '#FFFFFF',
  strokeWidth = 2,
  size,
}) => (
  <Svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Polygon
      points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

//  Close / X
export const CloseIcon = ({
  width = 18,
  height = 18,
  color = '#6B7280',
  strokeWidth = 2.5,
  size,
}) => (
  <Svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M18 6 6 18M6 6l12 12"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

//  Refresh
export const RefreshIcon = ({
  width = 18,
  height = 18,
  color = '#1B5FA8',
  strokeWidth = 2,
  size,
}) => (
  <Svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M23 4v6h-6M1 20v-6h6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

//  QR / Scan
export const ScanIcon = ({
  width = 22,
  height = 22,
  color = '#FFFFFF',
  strokeWidth = 2,
  size,
}) => (
  <Svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18h3v3M14 21v1"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

//  Info — circled "i", used for inline hints
export const InfoIcon = ({
  width = 14,
  height = 14,
  color = '#1B5FA8',
  strokeWidth = 2,
  size,
}) => (
  <Svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M12 11v5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M12 8h.01"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);
