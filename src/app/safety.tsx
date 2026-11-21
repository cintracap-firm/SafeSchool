import { router } from 'expo-router';
import { Button, Card, Copy, Pill, Row, Screen } from '../components/Presentation';
import { demoAssignment } from '../state/demoReducer';
import { useDemoStore } from '../state/demoStore';

export default function Safety() {
  const vehicle = useDemoStore((state) => state.demo.vehicle);
  const dispatch = useDemoStore((state) => state.dispatch);
  const approved = vehicle.inspectionStatus === 'approved';
  return (
    <Screen title="FleetCare" subtitle="Vehicle safety passport">
      <Card title={demoAssignment.plate}>
        <Pill warning={!approved}>{approved ? 'Demo approved' : 'Inspection pending'}</Pill>
        <Row label="Vehicle type" value="School minibus" />
        <Row label="Seat capacity" value={String(vehicle.capacity)} />
        <Row label="Insurance (demo)" value="On file" />
        <Row label="Driver eligibility" value="Verified in demo" />
        <Row label="Brake service restriction" value={vehicle.hasCriticalRestriction ? 'Critical · unresolved' : 'Cleared in demo'} />
      </Card>
      <Card title="Reviewer simulation">
        <Copy>Simulate a school reviewer recording a completed brake service and approving the vehicle for the demo route.</Copy>
        <Button label={approved ? 'Demo inspection approved' : 'Simulate reviewer approval'} disabled={approved} onPress={() => dispatch({ type: 'approveInspection' })} />
        {approved && <Button secondary label="Return to school assignment" onPress={() => router.navigate('/admin')} />}
      </Card>
    </Screen>
  );
}
