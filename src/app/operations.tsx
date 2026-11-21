import { useState } from 'react';
import { Button, Card, Copy, Pill, Screen } from '../components/Presentation';
import { buildOperationsResponse } from '../state/demoReducer';
import { useDemoStore } from '../state/demoStore';

export default function Operations() {
  const trip = useDemoStore((state) => state.demo.trip);
  const [reviewedTrip, setReviewedTrip] = useState<typeof trip>();
  const response = reviewedTrip === trip ? buildOperationsResponse(trip) : null;
  return (
    <Screen title="SchoolSafe AI" subtitle="Operations assistant">
      <Card title="Journey briefing">
        <Pill>Rules-based demo response</Pill>
        <Copy>What’s happening on the current journey, and what should we tell parents?</Copy>
        <Button label="Review journey" onPress={() => setReviewedTrip(trip)} />
      </Card>
      {response && <>
        <Card title="Operational explanation"><Copy>{response.operationalExplanation}</Copy></Card>
        <Card title="Next action"><Copy>{response.recommendedAction}</Copy></Card>
        <Card title="Parent notification draft"><Pill>Draft only</Pill><Copy>{response.parentNotificationDraft}</Copy></Card>
      </>}
    </Screen>
  );
}
