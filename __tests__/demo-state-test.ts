import {
  buildOperationsResponse,
  createInitialDemoState,
  getAssignmentBlockReason,
  reduceDemoState,
} from '../src/state/demoReducer';

describe('SchoolSafe demo state', () => {
  test('pending inspection blocks assignment publication', () => {
    const initial = createInitialDemoState();

    expect(getAssignmentBlockReason(initial)).toContain('inspection');
  });

  test('critical vehicle restriction blocks assignment publication', () => {
    const initial = createInitialDemoState();

    expect(
      getAssignmentBlockReason({
        ...initial,
        vehicle: { ...initial.vehicle, inspectionStatus: 'approved', hasCriticalRestriction: true },
      }),
    ).toContain('restriction');
  });

  test('unverified driver blocks assignment publication', () => {
    const initial = createInitialDemoState();

    expect(
      getAssignmentBlockReason({
        ...initial,
        vehicle: { ...initial.vehicle, inspectionStatus: 'approved', hasCriticalRestriction: false },
        driver: { isVerified: false },
      }),
    ).toMatch(/driver/i);
  });

  test('pupil count above vehicle capacity blocks assignment publication', () => {
    const initial = createInitialDemoState();

    expect(
      getAssignmentBlockReason({
        ...initial,
        vehicle: { ...initial.vehicle, inspectionStatus: 'approved', hasCriticalRestriction: false, capacity: 17 },
      }),
    ).toContain('capacity');
  });

  test('publishes only after inspection approval and a safe assignment', () => {
    const initial = createInitialDemoState();

    const blocked = reduceDemoState(initial, { type: 'publishAssignment' });
    expect(blocked.termAssignment.isPublishedToParents).toBe(false);

    const approved = reduceDemoState(initial, { type: 'approveInspection' });
    const published = reduceDemoState(approved, { type: 'publishAssignment' });
    expect(published.termAssignment.isPublishedToParents).toBe(true);
  });

  test('delay raises ETA and fallback does not invent an unverified cause', () => {
    const initial = createInitialDemoState();
    const delayed = reduceDemoState(initial, { type: 'triggerDelay' });

    expect(delayed.trip.etaMinutesRemaining).toBeGreaterThan(initial.trip.etaMinutesRemaining);
    expect(buildOperationsResponse(delayed.trip).operationalExplanation).toContain('not verified');
    expect(buildOperationsResponse(delayed.trip).operationalExplanation).not.toContain('traffic jam');
  });

  test('destination arrival does not complete the trip before handover', () => {
    let state = createInitialDemoState();
    for (let step = 0; step < 8 && state.trip.stage !== 'destination_reached'; step += 1) {
      state = reduceDemoState(state, { type: 'advanceTrip' });
    }

    expect(state.trip.stage).toBe('destination_reached');
    expect(state.trip.isCompleted).toBe(false);
    const completed = reduceDemoState(state, { type: 'confirmHandover' });
    expect(completed.trip.isCompleted).toBe(true);
    expect(completed.trip.stage).toBe('handover_confirmed');
  });

  test('advancing after handover leaves the final state unchanged', () => {
    let state = createInitialDemoState();
    for (let step = 0; step < 8 && state.trip.stage !== 'destination_reached'; step += 1) {
      state = reduceDemoState(state, { type: 'advanceTrip' });
    }
    state = reduceDemoState(state, { type: 'confirmHandover' });

    expect(reduceDemoState(state, { type: 'advanceTrip' })).toEqual(state);
  });
});
