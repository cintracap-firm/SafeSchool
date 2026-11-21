import { router } from 'expo-router';
import { Button, Card, Copy, Pill, Row, Screen } from '../components/Presentation';
import { demoAssignment } from '../state/demoReducer';
import { useDemoStore } from '../state/demoStore';

export default function Driver() {
  const { driver, vehicle, termAssignment, trip } = useDemoStore((state) => state.demo);
  const assignment = trip.actualAssignment ?? (termAssignment.isPublishedToParents ? demoAssignment : null);
  return (
    <Screen title="Driver & vehicle" subtitle="Parent view">
      {assignment ? <>
        <Card title={assignment.driver}>
          <Pill warning={!driver.isVerified}>{driver.isVerified ? 'School-verified driver' : 'Verification pending'}</Pill>
          <Button label="Track live" onPress={() => router.navigate('/journey')} />
        </Card>
        <Card title="Assigned school minibus">
          <Row label="Vehicle plate" value={assignment.plate} />
          <Row label="Inspection" value={vehicle.inspectionStatus === 'approved' ? 'Demo approved' : 'Pending'} />
          <Row label="Capacity" value={`${vehicle.capacity} seats`} />
          <Row label="Assigned" value={`${termAssignment.pupilCount} pupils`} />
        </Card>
      </> : <Card title="Assignment pending">
        <Copy>The school will publish the verified driver and vehicle after the safety review.</Copy>
      </Card>}
    </Screen>
  );
}
