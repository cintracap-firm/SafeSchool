import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import { corridors } from '../state/demoCorridors';
import { Button, Card, Copy, Pill, Row, Screen } from '../components/Presentation';
import { SimulatedRouteMap } from '../components/SimulatedRouteMap';
import { milestones, stageLabel, tripProgress } from '../state/demoReducer';
import { useDemoStore } from '../state/demoStore';

export default function Journey() {
  const { trip, termAssignment } = useDemoStore((state) => state.demo);
  const dispatch = useDemoStore((state) => state.dispatch);
  const progress = tripProgress(trip.stage);
  const arrived = progress >= 5;
  const canAdvance = termAssignment.isPublishedToParents && !arrived;
  const corridor = corridors[trip.mode];
  const [playing, setPlaying] = useState(false);
  const [mapError, setMapError] = useState(false);
  useFocusEffect(useCallback(() => () => setPlaying(false), []));
  useFocusEffect(useCallback(() => {
    if (!playing || !canAdvance) return;
    const timer = setInterval(() => dispatch({ type: 'advanceTrip' }), 4500);
    return () => clearInterval(timer);
  }, [playing, canAdvance, dispatch]));
  const openMap = () => {
    const route = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(corridor.origin)}&destination=${encodeURIComponent(corridor.destination)}&travelmode=driving`;
    void Linking.openURL(route).catch(() => setMapError(true));
  };
  return (
    <Screen title="Journey tracker" subtitle={trip.locationLabel}>
      <Card title="Route position">
        <Pill>Simulated GPS</Pill>
        <SimulatedRouteMap progress={progress} />
        <Row label="Simulated checkpoint" value={corridor.stops[Math.min(progress, 5)]} />
        <Row label="Route progress" value={`${Math.min(progress, 5) * 20}%`} />
        <Row label="Scheduled departure" value={corridor.departure} />
        <Button secondary label="Open corridor in Google Maps" onPress={openMap} />
        {mapError && <Copy>Google Maps could not open. The simulated map is still available here.</Copy>}
        <Row label="Current status" value={stageLabel(trip.stage, trip.mode)} />
        <Row label="ETA" value={arrived ? 'Arrived' : `${trip.etaMinutesRemaining} min`} />
        <Row label="Last update" value={trip.locationFreshnessMinutes ? `${trip.locationFreshnessMinutes} min ago` : 'Just now (simulated)'} />
        {trip.actualAssignment && <Row label="Trip vehicle" value={trip.actualAssignment.plate} />}
        {trip.delayReported && <Pill warning>Delay reported</Pill>}
      </Card>
      <Card title="Simulation controls">
        {!termAssignment.isPublishedToParents && <Copy>Publish a safe assignment in School to begin.</Copy>}
        <Button label="Advance journey" disabled={arrived || !termAssignment.isPublishedToParents} onPress={() => dispatch({ type: 'advanceTrip' })} />
        <Button secondary label={playing && canAdvance ? 'Pause autoplay' : 'Start autoplay'} disabled={!canAdvance} onPress={() => setPlaying(!playing)} />
        <Button secondary={!(arrived || trip.delayReported || progress !== 3)} label="Simulate delay" disabled={arrived || trip.delayReported || progress !== 3} onPress={() => dispatch({ type: 'triggerDelay' })} />
        <Button secondary label={trip.mode === 'daily' ? 'Switch to school trip' : 'Switch to daily route'} onPress={() => { setPlaying(false); dispatch({ type: 'selectTripMode', mode: trip.mode === 'daily' ? 'schoolTrip' : 'daily' }); }} />
      </Card>
      {arrived && <Card title="Attendant · Guardian handover">
        <Copy>{trip.isCompleted ? 'Guardian handover confirmed in the demo.' : 'Confirm only once the guardian has received Amina in the simulation.'}</Copy>
        <Button label="Confirm guardian handover" disabled={trip.isCompleted} onPress={() => dispatch({ type: 'confirmHandover' })} />
      </Card>}
      <Card title="Journey milestones">
        {milestones.map((stage, step) => <Row key={stage} label={stageLabel(stage, trip.mode)} value={step < progress ? 'Done' : step === progress ? 'Current' : 'Upcoming'} />)}
      </Card>
    </Screen>
  );
}
