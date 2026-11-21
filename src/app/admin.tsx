import { router } from 'expo-router';
import { Button, Card, Copy, Pill, Row, Screen } from '../components/Presentation';
import { demoAssignment, getAssignmentBlockReason } from '../state/demoReducer';
import { useDemoStore } from '../state/demoStore';

export default function Admin() {
  const demo = useDemoStore((state) => state.demo);
  const dispatch = useDemoStore((state) => state.dispatch);
  const blocker = getAssignmentBlockReason(demo);
  const published = demo.termAssignment.isPublishedToParents;
  return (
    <Screen title="School command center" subtitle="Nakasero Community School · Transport office">
      <Card title="Term assignment">
        <Pill warning={!!blocker}>{blocker ? 'Publication blocked' : published ? 'Published to parents' : 'Ready to publish'}</Pill>
        <Row label="Route" value={demo.trip.locationLabel} />
        <Row label="Driver" value={demoAssignment.driver} />
        <Row label="Driver eligibility" value={demo.driver.isVerified ? 'Verified' : 'Unverified'} />
        <Row label="Vehicle" value={demoAssignment.plate} />
        <Row label="Seats assigned" value={`${demo.termAssignment.pupilCount} / ${demo.vehicle.capacity}`} />
        {blocker && <Copy>{blocker}</Copy>}
        <Button label={published ? 'Assignment published' : 'Publish assignment'} disabled={!!blocker || published} onPress={() => dispatch({ type: 'publishAssignment' })} />
        {blocker && <Button secondary label="Open FleetCare" onPress={() => router.navigate('/safety')} />}
      </Card>
      <Card title="Presentation controls">
        <Copy>Reset the inspection, assignment, journey and notification draft to their starting state.</Copy>
        <Button secondary label="Reset demo" onPress={() => dispatch({ type: 'resetDemo' })} />
      </Card>
    </Screen>
  );
}
