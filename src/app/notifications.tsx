import { router } from 'expo-router';
import { Button, Card, Copy, Pill, Row, Screen } from '../components/Presentation';
import { useDemoStore } from '../state/demoStore';

export default function Notifications() {
  const { trip, termAssignment } = useDemoStore((state) => state.demo);
  return (
    <Screen title="Safety alerts" subtitle="Simulated journey activity">
      {trip.delayReported && <Card title="Delay reported">
        <Pill warning>Simulated event</Pill>
        <Copy>The vehicle reported a delay during the demo. Open Live for the current ETA.</Copy>
        <Button secondary label="Open live journey" onPress={() => router.navigate('/journey')} />
      </Card>}
      <Card title="Trip record created">
        <Copy>{termAssignment.isPublishedToParents ? 'The school published the driver and vehicle assignment.' : 'The route is waiting for fleet review and publication.'}</Copy>
        <Row label="Scheduled demo update" value="07:02 EAT" />
      </Card>
      {trip.isCompleted && <Card title="Guardian handover confirmed"><Copy>The attendant completed the simulated handover for Amina.</Copy></Card>}
    </Screen>
  );
}
