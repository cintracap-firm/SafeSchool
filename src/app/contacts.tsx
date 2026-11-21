import { Card, Copy, Row, Screen } from '../components/Presentation';

export default function Contacts() {
  return (
    <Screen title="Emergency contacts" subtitle="Amina's fictional demo directory">
      <Card title="Guardian contacts">
        <Row label="Sarah Nalongo" value="Primary guardian" />
        <Row label="Robert Musoke" value="Backup guardian" />
        <Copy>This demo directory uses fictional people and omits dialable numbers.</Copy>
      </Card>
    </Screen>
  );
}
