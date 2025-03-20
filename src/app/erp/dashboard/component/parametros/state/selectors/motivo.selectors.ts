import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MotivoState } from '../reducers/motivo.reducer';

export const selectState = createFeatureSelector<MotivoState>('motivo');

export const selectMotivo = createSelector(
   selectState,
    (state) => state.motivo
);

export const selectMotivoError = createSelector(
   selectState,
    (state) => state.error
);
export const selectMotivoById = createSelector(
    selectState,
    (state, props: { id: number }) => state.motivo?.find((item) => item.motivoId === props.id)
);

