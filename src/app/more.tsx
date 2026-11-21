import { router } from 'expo-router';
import { Button, Card, Copy, Screen } from '../components/Presentation';
import { useDemoStore } from '../state/demoStore';

export default function More() {
  const delayed = useDemoStore((state) => state.demo.trip.delayReported);
  return (
    <Screen title="More" subtitle="Journey updates and school tools">
      <Card title="Safety alerts">
        <Copy>{delayed ? 'A simulated delay was reported. Open Live for the updated arrival estimate.' : 'No safety alerts for the current demo journey.'}</Copy>
        {delayed && <Button secondary label="View live journey" onPress={() => router.navigate('/journey')} />}
      </Card>
      <Card title="School tools">
        <Button secondary label="Operations assistant" onPress={() => router.navigate('/operations')} />
        <Button secondary label="Open school command center" onPress={() => router.navigate('/admin')} />
      </Card>
    </Screen>
  );
}
