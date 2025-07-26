import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LogState } from '../reducers/log.reducer';

export const selectState = createFeatureSelector<LogState>('log');

export const selectLog = createSelector(
   selectState,
    (state) => state.log
);

export const selectLogError = createSelector(
   selectState,
    (state) => state.error
);
export const selectLogById = createSelector(
    selectState,
    (state, props: { id: number }) => state.log?.find((item) => item.logId === props.id)
);

