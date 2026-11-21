import { BlurTargetView, BlurView } from 'expo-blur';
import { Link, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BadgeCheck, Bell, BarChart3, BusFront, ClipboardList, Ellipsis, House, MapPin, ShieldCheck, Wrench } from 'lucide-react-native';
import { useRef, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDemoStore } from '../state/demoStore';
import { colors } from '../components/Presentation';

const roles = [
  { label: 'Parents', href: '/', icon: ShieldCheck },
  { label: 'School Admin', href: '/admin', icon: ClipboardList },
  { label: 'FleetCare', href: '/safety', icon: Wrench },
  { label: 'Driver / Attendant', href: '/attendant', icon: BusFront },
  { label: 'Authority', href: '/authority', icon: BarChart3 },
] as const;

const destinations = [
  { label: 'Home', href: '/', icon: House },
  { label: 'Live', href: '/journey', icon: MapPin },
  { label: 'Driver', href: '/driver', icon: BadgeCheck },
  { label: 'More', href: '/more', icon: Ellipsis },
] as const;

export default function Layout() {
  const path = usePathname();
  const delayReported = useDemoStore((state) => state.demo.trip.delayReported);
  const blurTarget = useRef<ComponentRef<typeof View>>(null);
  const { bottom } = useSafeAreaInsets();
  const rolePath = path === '/operations' ? '/admin'
    : roles.some(({ href }) => href === path) ? path : '/';

  return (
    <View style={nav.shell}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top', 'left', 'right']} style={nav.header}>
        <View style={nav.headerInner}>
          <View style={nav.brand}>
            <View style={nav.mark}><ShieldCheck size={22} color="#FFF" /></View>
            <View><Text style={nav.name}>SchoolSafe</Text><Text style={nav.context}>{roles.find(({ href }) => href === rolePath)?.label} · Demo</Text></View>
            <Link href="/notifications" asChild>
              <Pressable accessibilityLabel={delayReported ? 'Notifications, delay reported' : 'Notifications'} style={nav.bell}>
                <Bell size={21} color={colors.navy} />
                {delayReported && <View style={nav.alertDot} />}
              </Pressable>
            </Link>
          </View>
          <View style={nav.roles}>
            {roles.map(({ label, href, icon: Icon }) => {
              const selected = rolePath === href;
              return <Link key={href} href={href} asChild>
                <Pressable accessibilityState={{ selected }} style={StyleSheet.flatten([nav.chip, selected && nav.active])}>
                  <Icon size={15} color={selected ? '#81E9CC' : colors.muted} />
                  <Text style={[nav.chipLabel, selected && nav.activeLabel]}>{label}</Text>
                </Pressable>
              </Link>;
            })}
          </View>
        </View>
      </SafeAreaView>
      <BlurTargetView ref={blurTarget} style={nav.content}>
        <Stack screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: colors.cloud } }} />
      </BlurTargetView>
      <View pointerEvents="box-none" style={[nav.dockArea, { bottom: bottom + 12 }]}>
        <View style={nav.dockShadow}>
          <View style={nav.dock}>
            <BlurView pointerEvents="none" blurTarget={blurTarget} blurMethod="dimezisBlurViewSdk31Plus" intensity={65} tint="light" style={StyleSheet.absoluteFill} />
            {destinations.map(({ label, href, icon: Icon }) => {
              const selected = path === href;
              return <Link key={href} href={href} asChild>
                <Pressable accessibilityState={{ selected }} style={StyleSheet.flatten([nav.destination, selected && nav.active])}>
                  <Icon size={19} color={selected ? '#FFF' : colors.muted} />
                  <Text style={[nav.destinationLabel, selected && nav.activeLabel]}>{label}</Text>
                </Pressable>
              </Link>;
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const nav = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.cloud },
  header: { backgroundColor: colors.cloud, borderBottomWidth: 1, borderColor: colors.border },
  headerInner: { width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, gap: 10 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bell: { marginLeft: 'auto', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border },
  alertDot: { position: 'absolute', right: 10, top: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: '#BA3434' },
  mark: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 20, fontWeight: '800', color: colors.navy },
  context: { fontSize: 12, color: colors.muted },
  roles: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { minHeight: 44, paddingHorizontal: 9, borderRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border },
  chipLabel: { fontSize: 13, fontWeight: '700', color: colors.muted },
  active: { backgroundColor: colors.navy, borderColor: colors.navy },
  activeLabel: { color: '#FFF' },
  content: { flex: 1 },
  dockArea: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  dockShadow: { width: '100%', maxWidth: 480, borderRadius: 34, boxShadow: '0 8px 28px rgba(16,36,58,0.18)' },
  dock: { borderRadius: 34, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.58)', borderWidth: 1, borderColor: '#FFF', padding: 5, flexDirection: 'row', gap: 4 },
  destination: { flex: 1, minHeight: 49, borderRadius: 28, alignItems: 'center', justifyContent: 'center', gap: 2 },
  destinationLabel: { fontSize: 12, fontWeight: '700', color: colors.muted },
});
