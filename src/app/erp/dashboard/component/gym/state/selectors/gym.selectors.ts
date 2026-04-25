import { createSelector, createFeatureSelector } from '@ngrx/store';
import { GymState } from '../reducers/gym.reducer';

export const selectState = createFeatureSelector<GymState>('gym');

export const selectGym = createSelector(
   selectState,
    (state) => state.gym
);

export const selectGymError = createSelector(
   selectState,
    (state) => state.error
);
export const selectGymById = createSelector(
    selectState,
    (state, props: { id: number }) => state.gym?.find((item) => item.gymId === props.id)
);

