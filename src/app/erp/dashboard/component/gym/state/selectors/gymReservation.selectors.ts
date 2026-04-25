import { createSelector, createFeatureSelector } from '@ngrx/store';
import { GymReservationState } from '../reducers/gymReservation.reducer';

export const selectState = createFeatureSelector<GymReservationState>('gymReservation');

export const selectGymReservation = createSelector(
   selectState,
    (state) => state.gymReservation
);

export const selectGymReservationError = createSelector(
   selectState,
    (state) => state.error
);
export const selectGymReservationById = createSelector(
    selectState,
    (state, props: { id: number }) => state.gymReservation?.find((item) => item.gymReservationId === props.id)
);

