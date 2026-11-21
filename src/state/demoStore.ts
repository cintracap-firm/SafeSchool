import { create } from 'zustand';
import { createInitialDemoState, reduceDemoState, type DemoAction, type DemoState } from './demoReducer';

export const useDemoStore = create<{ demo: DemoState; dispatch: (action: DemoAction) => void }>((set) => ({
  demo: createInitialDemoState(),
  dispatch: (action) => set(({ demo }) => ({ demo: reduceDemoState(demo, action) })),
}));
