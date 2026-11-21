import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const colors = { navy: '#10243A', green: '#087F65', cloud: '#F4F7FA', amber: '#875104', muted: '#526576', border: '#E0E8EB', mint: '#DCF3EA' };

export function Screen({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.column}>
          <View style={styles.intro}><Text accessibilityRole="header" style={styles.title}>{title}</Text><Text style={styles.body}>{subtitle}</Text></View>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ title, children, dark = false }: { title: string; children: ReactNode; dark?: boolean }) {
  return <View style={[styles.card, dark && styles.dark]}><Text accessibilityRole="header" style={[styles.heading, dark && styles.white]}>{title}</Text>{children}</View>;
}

export function Copy({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <Text style={[styles.body, light && styles.light]}>{children}</Text>;
}

export function Row({ label, value }: { label: string; value: string }) {
  return <View style={styles.row}><Text style={[styles.body, styles.cell]}>{label}</Text><Text style={[styles.value, styles.cell]}>{value}</Text></View>;
}

export function Pill({ children, warning = false }: { children: ReactNode; warning?: boolean }) {
  return <Text style={[styles.pill, warning && styles.warning]}>{children}</Text>;
}

export function Button({ label, onPress, disabled = false, secondary = false }: { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, secondary && styles.secondary, disabled && styles.disabled, pressed && styles.pressed]}>
    <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{label}</Text>
  </Pressable>;
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cloud },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 96 },
  column: { width: '100%', maxWidth: 560, alignSelf: 'center', gap: 14 },
  intro: { gap: 4, marginBottom: 4 },
  title: { color: colors.navy, fontWeight: '800', fontSize: 32, letterSpacing: -1 },
  heading: { color: colors.navy, fontWeight: '800', fontSize: 20 },
  body: { color: colors.muted, lineHeight: 22, fontSize: 15 },
  card: { padding: 18, gap: 12, borderRadius: 23, backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border },
  dark: { backgroundColor: colors.navy, borderColor: colors.navy },
  white: { color: '#FFF' },
  light: { color: '#D8E8F2' },
  row: { flexDirection: 'row', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  cell: { flex: 1 },
  value: { color: colors.navy, textAlign: 'right', fontSize: 15, fontWeight: '700' },
  pill: { alignSelf: 'flex-start', overflow: 'hidden', backgroundColor: colors.mint, color: '#065D4B', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, fontWeight: '700' },
  warning: { backgroundColor: '#FFF0D6', color: colors.amber },
  button: { minHeight: 48, borderRadius: 16, backgroundColor: colors.green, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10 },
  secondary: { backgroundColor: '#EAF1F5' },
  disabled: { backgroundColor: '#5E707D' },
  pressed: { opacity: 0.82 },
  buttonText: { color: '#FFF', fontWeight: '800', textAlign: 'center', fontSize: 15 },
  secondaryText: { color: colors.navy },
  eta: { color: '#FFF', fontSize: 45, fontWeight: '800', letterSpacing: -2 },
});
