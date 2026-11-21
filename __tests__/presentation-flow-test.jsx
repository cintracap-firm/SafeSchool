import { fireEvent, render, screen } from '@testing-library/react-native';
import Admin from '../src/app/admin';
import Parent from '../src/app/index';
import Journey from '../src/app/journey';
import Operations from '../src/app/operations';
import Safety from '../src/app/safety';
import { useDemoStore } from '../src/state/demoStore';

jest.mock('lucide-react-native', () => ({ ArrowUpRight: () => null, BadgeCheck: () => null, Bell: () => null, MapPin: () => null, Phone: () => null }));
jest.mock('react-native-svg', () => ({ __esModule: true, default: () => null, Circle: () => null, Path: () => null, Rect: () => null }));
jest.mock('expo-router', () => ({ router: { navigate: jest.fn() }, useFocusEffect: (effect) => jest.requireActual('react').useEffect(effect, [effect]) }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: jest.requireActual('react-native').View,
}));

function pressButton(name) {
  return fireEvent.press(screen.getByRole('button', { name }));
}

test('publishes a safe assignment and completes a delayed journey after handover', async () => {
  useDemoStore.getState().dispatch({ type: 'resetDemo' });
  const view = await render(<Admin />);
  expect(screen.getByRole('button', { name: 'Publish assignment' })).toBeDisabled();
  expect(screen.getByText('Vehicle inspection is pending.')).toBeTruthy();

  await view.rerender(<Safety />);
  await pressButton('Simulate reviewer approval');
  await view.rerender(<Admin />);
  await pressButton('Publish assignment');
  await view.rerender(<Parent />);
  expect(screen.getByText('Musa Kato')).toBeTruthy();
  expect(screen.getAllByText('UBM 214P')).toHaveLength(2);

  await view.rerender(<Journey />);
  for (let i = 0; i < 3; i += 1) {
    await pressButton('Advance journey');
  }
  await pressButton('Simulate delay');
  expect(screen.getByText('18 min')).toBeTruthy();

  await view.rerender(<Operations />);
  await pressButton('Review journey');
  expect(screen.getByText(/delay cause is not verified/i)).toBeTruthy();
  expect(screen.getByText('Draft only')).toBeTruthy();

  await view.rerender(<Journey />);
  await pressButton('Advance journey');
  await pressButton('Advance journey');
  expect(useDemoStore.getState().demo.trip.isCompleted).toBe(false);
  await pressButton('Confirm guardian handover');
  await view.rerender(<Parent />);
  expect(screen.getByText('Handed over')).toBeTruthy();
}, 120000);
