import { createSelector, createFeatureSelector } from '@ngrx/store';
import { GymBranchState } from '../reducers/gymBranch.reducer';

export const selectState = createFeatureSelector<GymBranchState>('gymBranch');

export const selectGymBranch = createSelector(
   selectState,
    (state) => state.gymBranch
);

export const selectGymBranchError = createSelector(
   selectState,
    (state) => state.error
);
export const selectGymBranchById = createSelector(
    selectState,
    (state, props: { id: number }) => state.gymBranch?.find((item) => item.gymBranchId === props.id)
);

