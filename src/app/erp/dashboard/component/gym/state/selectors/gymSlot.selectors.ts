import { createSelector, createFeatureSelector } from '@ngrx/store';
import { GymSlotState } from '../reducers/gymSlot.reducer';

export const selectState = createFeatureSelector<GymSlotState>('gymSlot');

export const selectGymSlot = createSelector(
   selectState,
    (state) => state.gymSlot
);

export const selectGymSlotError = createSelector(
   selectState,
    (state) => state.error
);
export const selectGymSlotById = createSelector(
    selectState,
    (state, props: { id: number }) => state.gymSlot?.find((item) => item.gymSlotId === props.id)
);

