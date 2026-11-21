import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from './Presentation';

const stops = [[29, 115], [76, 107], [117, 73], [171, 78], [216, 121], [290, 57]];

export function SimulatedRouteMap({ progress }: { progress: number }) {
  const [x, y] = stops[Math.min(progress, stops.length - 1)];
  return (
    <View accessibilityLabel="Illustrated simulated route" accessible style={{ backgroundColor: '#EAF2EE', borderRadius: 18, overflow: 'hidden' }}>
      <Svg width="100%" height={166} viewBox="0 0 320 166">
        <Rect width="320" height="166" fill="#EAF2EE" />
        <Path d="M-10 38 Q55 84 120 29 T330 25 M-10 143 Q52 118 122 146 T335 125 M85 -15 Q79 50 107 92 T145 185 M212 -15 Q181 50 202 88 T250 177" stroke="#FFF" strokeWidth={7} fill="none" />
        <Path d="M29 115 L76 107 L117 73 L171 78 L216 121 L290 57" stroke={colors.green} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {stops.map(([cx, cy]) => <Circle key={cx} cx={cx} cy={cy} r={5} fill="#FFF" stroke={colors.green} strokeWidth={2} />)}
        <Circle cx={x} cy={y} r={12} fill={colors.navy} stroke="#FFF" strokeWidth={3} />
      </Svg>
    </View>
  );
}
