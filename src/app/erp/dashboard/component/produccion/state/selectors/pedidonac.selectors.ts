import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PedidonacState } from '../reducers/pedidonac.reducer';

export const selectState = createFeatureSelector<PedidonacState>('pedidonac');

export const selectPedidonac = createSelector(
   selectState,
    (state) => state.pedidonac
);

export const selectPedidonacError = createSelector(
   selectState,
    (state) => state.error
);
export const selectPedidonacById = createSelector(
    selectState,
    (state, props: { id: number }) => state.pedidonac?.find((item) => item.pedidonacId === props.id)
);

export const selectEmpresaPdf = createSelector(
    selectState,
    (state) => state.empresa
);  
