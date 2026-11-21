import { Button, Card, Copy, Pill, Row, Screen } from '../components/Presentation';
import { stageLabel, tripProgress } from '../state/demoReducer';
import { useDemoStore } from '../state/demoStore';

export default function Attendant() {
  const { trip, termAssignment } = useDemoStore((state) => state.demo);
  const dispatch = useDemoStore((state) => state.dispatch);
  const progress = tripProgress(trip.stage);
  return (
    <Screen title="Trip manifest" subtitle="Driver / Attendant demo">
      <Card title={trip.locationLabel} dark>
        <Pill>{stageLabel(trip.stage, trip.mode)}</Pill>
        <Copy light>{termAssignment.isPublishedToParents ? 'Assignment published' : 'Waiting for the school to publish a safe assignment'}</Copy>
        <Button label="Advance trip" disabled={!termAssignment.isPublishedToParents || progress >= 5} onPress={() => dispatch({ type: 'advanceTrip' })} />
        <Button label="Report simulated delay" secondary disabled={progress !== 3 || trip.delayReported} onPress={() => dispatch({ type: 'triggerDelay' })} />
      </Card>
      <Card title="Amina">
        <Row label="Boarding status" value={trip.isCompleted ? 'Handed over' : trip.isOnboard ? 'Onboard' : progress >= 5 ? 'Arrived' : 'Awaiting pickup'} />
        {progress < 5 && <Copy>Guardian handover becomes available after arrival.</Copy>}
        <Button label="Confirm guardian handover" disabled={trip.stage !== 'destination_reached'} onPress={() => dispatch({ type: 'confirmHandover' })} />
      </Card>
    </Screen>
  );
}
