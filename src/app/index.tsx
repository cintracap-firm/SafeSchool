import { ArrowUpRight, BadgeCheck, Bell, MapPin, Phone } from 'lucide-react-native';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, colors, Copy, Pill, Row, Screen, styles } from '../components/Presentation';
import { demoAssignment, stageLabel, tripProgress } from '../state/demoReducer';
import { useDemoStore } from '../state/demoStore';

export default function Parent() {
  const { trip, vehicle, termAssignment } = useDemoStore((state) => state.demo);
  const dispatch = useDemoStore((state) => state.dispatch);

  const assignment = trip.actualAssignment ?? (termAssignment.isPublishedToParents ? demoAssignment : null);
  const progress = Math.min(tripProgress(trip.stage), 5);
  const delayed = trip.stage === 'delayed';
  const route = trip.mode === 'daily' ? ['Nansana', 'Wakiso'] : ['Kampala', 'Jinja'];
  return (
    <Screen title="Amina’s journey" subtitle="Nakasero Community School · Parent view">
      <View style={parent.modeBar}>
        {(['daily', 'schoolTrip'] as const).map((mode) => (
          <Pressable key={mode} accessibilityRole="button" accessibilityState={{ selected: trip.mode === mode }}
            onPress={() => dispatch({ type: 'selectTripMode', mode })} style={[parent.mode, trip.mode === mode && parent.selectedMode]}>
            <Text style={[parent.modeText, trip.mode === mode && parent.selectedText]}>{mode === 'daily' ? 'Daily route' : 'School trip'}</Text>
          </Pressable>
        ))}
      </View>
      <Card title={`${route[0]} to ${route[1]}`} dark>
        <Pill warning={delayed || !assignment}>{assignment ? stageLabel(trip.stage, trip.mode) : 'Assignment pending'}</Pill>
        <View style={parent.etaRow}>
          <View style={parent.etaGroup}>
            <Copy light>Estimated arrival</Copy>
            <Text style={[styles.eta, parent.eta]}>{trip.etaMinutesRemaining > 0 ? `${trip.etaMinutesRemaining} min` : 'Arrived'}</Text>
          </View>
          <Button label="Track journey" onPress={() => router.navigate('/journey')} />
        </View>
        <View accessibilityLabel={`Journey progress ${Math.round(progress * 20)} percent`} accessible style={parent.track}>
          {Array.from({ length: 30 }, (_, index) => <View key={index} style={[parent.tick, index <= progress * 5.8 && parent.activeTick]} />)}
        </View>
        <View style={parent.endpoints}><Copy light>{route[0]}</Copy><Copy light>{route[1]}</Copy></View>
        <Text style={parent.feed}>{stageLabel(trip.stage, trip.mode)} · Simulated tracking</Text>
      </Card>
      <Text accessibilityRole="header" style={styles.heading}>Quick actions</Text>
      <View style={parent.quickGrid}>
        {([
          { label: 'Live Corridor', detail: `${progress * 20}% complete`, href: '/journey', icon: MapPin },
          { label: 'Driver & Bus', detail: assignment ? assignment.plate : 'Assignment pending', href: '/driver', icon: BadgeCheck },
          { label: 'Safety Alerts', detail: trip.delayReported ? 'Delay reported' : 'Journey updates', href: '/notifications', icon: Bell },
          { label: 'Emergency SOS', detail: 'Demo contacts', href: '/contacts', icon: Phone },
        ] as const).map(({ label, detail, href, icon: Icon }) => (
          <Pressable key={href} accessibilityRole="button" onPress={() => router.navigate(href)} style={parent.quickCard}>
            <View style={parent.endpoints}><Icon size={20} color={colors.green} /><ArrowUpRight size={16} color={colors.navy} /></View>
            <Text style={parent.quickLabel}>{label}</Text>
            <Copy>{detail}</Copy>
          </Pressable>
        ))}
      </View>
      <Card title="Recent journey activity">
        <Copy>{stageLabel(trip.stage, trip.mode)}{trip.delayReported ? ' · Delay reported' : ''}</Copy>
        <Button secondary label="View all activity" onPress={() => router.navigate('/notifications')} />
      </Card>
      <View>
        <Card title="Assigned driver & vehicle">
          {assignment ? <>
            <View style={parent.driver}>
              <View style={parent.avatar}><Text style={parent.avatarText}>MK</Text></View>
              <View style={parent.driverText}>
                <Text style={styles.heading}>{assignment.driver}</Text>
                <Text style={parent.verified}>School-verified driver · Demo</Text>
              </View>
            </View>
            <Row label="Vehicle plate" value={assignment.plate} />
            <Row label="Inspection" value={vehicle.inspectionStatus === 'approved' ? 'Demo approved' : 'Pending'} />
            <Row label="Pupils assigned" value={String(termAssignment.pupilCount)} />
          </> : <Copy>The school will publish the driver and vehicle after completing the safety review.</Copy>}
          <Row label="Amina’s boarding" value={trip.isOnboard ? 'Onboard' : trip.isCompleted ? 'Handed over' : 'Not onboard'} />
        </Card>
      </View>
    </Screen>
  );
}

const parent = StyleSheet.create({
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickCard: { flexGrow: 1, flexBasis: '46%', backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 14, gap: 5 },
  quickLabel: { fontWeight: '800', fontSize: 15, color: colors.navy },
  modeBar: { flexDirection: 'row', gap: 4, backgroundColor: '#E7EEF1', padding: 4, borderRadius: 28 },
  mode: { flex: 1, minHeight: 42, justifyContent: 'center', alignItems: 'center', borderRadius: 24 },
  selectedMode: { backgroundColor: colors.navy },
  modeText: { fontSize: 14, fontWeight: '700', color: colors.navy },
  selectedText: { color: '#FFF' },
  etaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  etaGroup: { flexShrink: 1 },
  eta: { fontSize: 37, fontVariant: ['tabular-nums'] },
  track: { flexDirection: 'row', gap: 3, height: 15 },
  tick: { flex: 1, borderRadius: 2, backgroundColor: '#365267' },
  activeTick: { backgroundColor: '#78E1C0' },
  endpoints: { flexDirection: 'row', justifyContent: 'space-between' },
  feed: { color: '#C4D6E0', fontSize: 13 },
  driver: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 6 },
  driverText: { flex: 1, gap: 3 },
  avatar: { width: 53, height: 53, borderRadius: 27, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#C0F1DF', fontSize: 17, fontWeight: '800' },
  verified: { color: colors.green, fontSize: 13, fontWeight: '700' },
});
