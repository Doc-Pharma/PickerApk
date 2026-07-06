import React, { useMemo } from 'react';
import Svg, { Rect } from 'react-native-svg';
import Colors from '../../theme/colors';

/**
 * QRVisual — renders a convincing QR code pattern using react-native-svg.
 * The dot pattern is deterministic from `value` so the same string
 * always produces the same visual. Not scannable, purely decorative.
 */
const QRVisual = ({
  value = '',
  size = 160,
  color = Colors.navy,
  bg = '#FFFFFF',
}) => {
  const modules = 21;
  const cell = size / modules;

  // Simple hash → deterministic bit matrix
  const bits = useMemo(() => {
    let h = 0;
    for (let i = 0; i < value.length; i++) {
      h = (Math.imul(31, h) + value.charCodeAt(i)) | 0;
    }
    const arr = [];
    for (let i = 0; i < modules * modules; i++) {
      arr.push(((h >>> i % 32) & 1) === 1);
    }
    return arr;
  }, [value]);

  const inCorner = (r, c) =>
    (r < 9 && c < 9) || // top-left
    (r < 9 && c > modules - 9) || // top-right
    (r > modules - 9 && c < 9); // bottom-left

  const co = cell * 7; // corner outer
  const ci = cell * 5; // corner inner
  const cd = cell * 3; // corner dot

  return (
    <Svg width={size} height={size}>
      {/* Background */}
      <Rect x={0} y={0} width={size} height={size} fill={bg} />

      {/* Data modules */}
      {Array.from({ length: modules }, (_, r) =>
        Array.from({ length: modules }, (_, c) => {
          if (inCorner(r, c)) return null;
          // timing strips
          if (r === 6 || c === 6) {
            return (r + c) % 2 === 0 ? (
              <Rect
                key={`t${r}${c}`}
                x={c * cell}
                y={r * cell}
                width={cell * 0.9}
                height={cell * 0.9}
                fill={color}
              />
            ) : null;
          }
          return bits[r * modules + c] ? (
            <Rect
              key={`d${r}${c}`}
              x={c * cell + 0.5}
              y={r * cell + 0.5}
              width={cell * 0.85}
              height={cell * 0.85}
              rx={1}
              fill={color}
            />
          ) : null;
        }),
      )}

      {/* Top-left finder */}
      <Rect x={0} y={0} width={co} height={co} rx={3} fill={color} />
      <Rect x={cell} y={cell} width={ci} height={ci} rx={2} fill={bg} />
      <Rect
        x={cell * 2}
        y={cell * 2}
        width={cd}
        height={cd}
        rx={1}
        fill={color}
      />

      {/* Top-right finder */}
      <Rect x={size - co} y={0} width={co} height={co} rx={3} fill={color} />
      <Rect
        x={size - co + cell}
        y={cell}
        width={ci}
        height={ci}
        rx={2}
        fill={bg}
      />
      <Rect
        x={size - co + cell * 2}
        y={cell * 2}
        width={cd}
        height={cd}
        rx={1}
        fill={color}
      />

      {/* Bottom-left finder */}
      <Rect x={0} y={size - co} width={co} height={co} rx={3} fill={color} />
      <Rect
        x={cell}
        y={size - co + cell}
        width={ci}
        height={ci}
        rx={2}
        fill={bg}
      />
      <Rect
        x={cell * 2}
        y={size - co + cell * 2}
        width={cd}
        height={cd}
        rx={1}
        fill={color}
      />
    </Svg>
  );
};

export default QRVisual;
