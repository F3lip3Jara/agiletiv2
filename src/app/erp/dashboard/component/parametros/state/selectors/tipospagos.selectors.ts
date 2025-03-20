import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TipospagosState } from '../reducers/tipospagos.reducer';

export const selectState = createFeatureSelector<TipospagosState>('tipospagos');

export const selectTipospagos = createSelector(
   selectState,
    (state) => state.tipospagos
);

export const selectTipospagosError = createSelector(
   selectState,
    (state) => state.error
);
export const selectTipospagosById = createSelector(
    selectState,
    (state, props: { id: number }) => state.tipospagos?.find((item) => item.tipospagosId === props.id)
);

