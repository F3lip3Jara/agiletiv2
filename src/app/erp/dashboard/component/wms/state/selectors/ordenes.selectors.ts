import { createSelector, createFeatureSelector } from '@ngrx/store';
import { OrdenesState } from '../reducers/ordenes.reducer';

export const selectState = createFeatureSelector<OrdenesState>('ordenes');

export const selectOrdenes = createSelector(
   selectState,
    (state) => state.ordenes
);

export const selectOrdenesError = createSelector(
   selectState,
    (state) => state.error
);
export const selectOrdenesById = createSelector(
    selectState,
    (state, props: { id: number }) => state.ordenes?.find((item) => item.ordenesId === props.id)
);

export const selectJobId = createSelector(
    selectState,
    (state) => state.jobId
);

export const selectColums = createSelector(
    selectState,
    (state) => state.colums
);


