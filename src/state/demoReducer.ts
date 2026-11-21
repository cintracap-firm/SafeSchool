export type TripMode = 'daily' | 'schoolTrip';

export type TripStage =
  | 'preparing_for_pickup'
  | 'approaching_pickup'
  | 'child_boarded'
  | 'en_route'
  | 'delayed'
  | 'approaching_destination'
  | 'destination_reached'
  | 'handover_confirmed';

export interface DemoState {
  vehicle: {
    inspectionStatus: 'pending' | 'approved';
    hasCriticalRestriction: boolean;
    capacity: number;
  };
  driver: {
    isVerified: boolean;
  };
  termAssignment: {
    pupilCount: number;
    isPublishedToParents: boolean;
  };
  trip: {
    mode: TripMode;
    stage: TripStage;
    etaMinutesRemaining: number;
    isCompleted: boolean;
    isOnboard: boolean;
    delayReported: boolean;
    actualAssignment: { driver: string; plate: string } | null;
    delayReason: string | null;
    locationLabel: string;
    locationFreshnessMinutes: number;
    maintenanceAlert: string | null;
  };
}

export type DemoAction =
  | { type: 'approveInspection' }
  | { type: 'publishAssignment' }
  | { type: 'advanceTrip' }
  | { type: 'triggerDelay' }
  | { type: 'confirmHandover' }
  | { type: 'selectTripMode'; mode: TripMode }
  | { type: 'resetDemo' };

export function createInitialDemoState(): DemoState {
  return {
    vehicle: {
      inspectionStatus: 'pending',
      hasCriticalRestriction: true,
      capacity: 24,
    },
    driver: {
      isVerified: true,
    },
    termAssignment: {
      pupilCount: 18,
      isPublishedToParents: false,
    },
    trip: {
      mode: 'daily',
      stage: 'preparing_for_pickup',
      etaMinutesRemaining: 18,
      isCompleted: false,
      isOnboard: false,
      delayReported: false,
      actualAssignment: null,
      delayReason: null,
      locationLabel: 'Kampalaâ€“Wakiso corridor',
      locationFreshnessMinutes: 2,
      maintenanceAlert: null,
    },
  };
}

export function getAssignmentBlockReason(state: DemoState): string | null {
  if (!state.driver.isVerified) {
    return 'Driver verification is required.';
  }
  if (state.vehicle.inspectionStatus !== 'approved') {
    return 'Vehicle inspection is pending.';
  }
  if (state.vehicle.hasCriticalRestriction) {
    return 'A critical safety restriction must be resolved.';
  }
  if (state.termAssignment.pupilCount > state.vehicle.capacity) {
    return 'Assigned pupils exceed vehicle seating capacity.';
  }
  return null;
}

export const demoAssignment = { driver: 'Musa Kato', plate: 'UBM 214P' };

export const milestones = [
  'preparing_for_pickup', 'approaching_pickup', 'child_boarded', 'en_route',
  'approaching_destination', 'destination_reached', 'handover_confirmed',
] as const satisfies readonly TripStage[];

export function tripProgress(stage: TripStage) {
  return stage === 'delayed' ? 3 : milestones.indexOf(stage);
}

export function stageLabel(stage: TripStage, mode: TripMode) {
  if (mode === 'schoolTrip' && stage === 'preparing_for_pickup') return 'Preparing for departure';
  if (mode === 'schoolTrip' && stage === 'approaching_pickup') return 'Boarding group';
  return stage[0].toUpperCase() + stage.slice(1).replaceAll('_', ' ');
}

export function reduceDemoState(state: DemoState, action: DemoAction): DemoState {
  const { trip } = state;
  const arrived = tripProgress(trip.stage) >= 5;
  switch (action.type) {
    case 'resetDemo':
      return createInitialDemoState();
    case 'approveInspection':
      return { ...state, vehicle: { ...state.vehicle, inspectionStatus: 'approved', hasCriticalRestriction: false } };
    case 'publishAssignment':
      if (getAssignmentBlockReason(state)) return state;
      return { ...state, termAssignment: { ...state.termAssignment, isPublishedToParents: true } };
    case 'selectTripMode':
      if (trip.mode === action.mode) return state;
      return {
        ...state,
        trip: {
          ...createInitialDemoState().trip,
          mode: action.mode,
          etaMinutesRemaining: action.mode === 'schoolTrip' ? 65 : 18,
          locationLabel: action.mode === 'schoolTrip' ? 'Kampala–Jinja corridor' : 'Kampala–Wakiso corridor',
        },
      };
    case 'advanceTrip': {
      if (arrived) return state;
      const stage = milestones[tripProgress(trip.stage) + 1];
      return {
        ...state,
        trip: {
          ...trip,
          stage,
          isOnboard: stage !== 'destination_reached' && (trip.isOnboard || stage === 'child_boarded'),
          actualAssignment: trip.actualAssignment ?? (state.termAssignment.isPublishedToParents ? demoAssignment : null),
          locationFreshnessMinutes: 0,
          etaMinutesRemaining: stage === 'destination_reached' ? 0 : Math.max(1, trip.etaMinutesRemaining - 4),
        },
      };
    }
    case 'triggerDelay':
      if (arrived || trip.stage === 'delayed' || trip.delayReported) return state;
      return {
        ...state,
        trip: {
          ...trip,
          stage: tripProgress(trip.stage) === 3 ? 'delayed' : trip.stage,
          delayReported: true,
          etaMinutesRemaining: trip.etaMinutesRemaining + 12,
        },
      };
    case 'confirmHandover':
      if (trip.stage !== 'destination_reached') return state;
      return { ...state, trip: { ...trip, stage: 'handover_confirmed', isCompleted: true } };
  }
}

export function buildOperationsResponse(trip: DemoState['trip']): {
  operationalExplanation: string;
  recommendedAction: string;
  parentNotificationDraft: string;
} {
  const status = stageLabel(trip.stage, trip.mode);
  const arrival = trip.etaMinutesRemaining === 0;
  const eta = arrival ? 'The vehicle has arrived.' : `Estimated arrival in ${trip.etaMinutesRemaining} minutes.`;
  const delay = trip.delayReported
    ? (trip.delayReason ?? 'The delay cause is not verified.')
    : 'No delay has been reported.';
  return {
    operationalExplanation: [
      `${status}. ${eta}`,
      `Simulated position: ${trip.locationLabel}. Last update ${trip.locationFreshnessMinutes} min ago.`,
      delay,
      trip.maintenanceAlert,
    ].filter(Boolean).join(' '),
    recommendedAction: trip.isCompleted
      ? 'Close the journey record.'
      : arrival ? 'Have the attendant confirm guardian handover.' : 'Review the ETA and share a parent update if needed.',
    parentNotificationDraft: `${status}. ${eta}`,
  };
}
