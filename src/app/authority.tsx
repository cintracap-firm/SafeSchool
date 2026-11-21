import { StyleSheet, Text, View } from 'react-native';
import { Card, colors, Copy, Pill, Row, Screen } from '../components/Presentation';

const compliance = [72, 76, 81, 79, 86, 92];

export default function Authority() {
  return (
    <Screen title="Compliance overview" subtitle="Authority demo">
      <Pill warning>Fictional aggregate data</Pill>
      <Card title="Fleet summary">
        <Row label="Participating schools" value="14" />
        <Row label="Registered vehicles" value="48" />
        <Row label="Open safety blocks" value="2" />
        <Copy>This preview uses sample records without a government connection.</Copy>
      </Card>
      <Card title="Weekly inspection compliance">
        <View style={chart.row}>
          {compliance.map((rate, index) => (
            <View key={index} accessible accessibilityLabel={`Week ${index + 1}: ${rate} percent`} style={chart.column}>
              <View style={[chart.bar, { height: rate, backgroundColor: index >= 4 ? colors.green : colors.navy }]} />
              <Text style={chart.label}>W{index + 1}</Text><Text style={chart.value}>{rate}%</Text>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const chart = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  column: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  bar: { width: '65%', borderRadius: 5 },
  label: { color: colors.muted, fontSize: 12 },
  value: { color: colors.navy, fontWeight: '700', fontSize: 12 },
});
