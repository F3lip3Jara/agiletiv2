import { createSelector, createFeatureSelector } from '@ngrx/store';
import { DataStateEmpresa } from '../../../app.state';

export const selectState = createFeatureSelector<DataStateEmpresa>('empresa');

export const selectEmpresa = createSelector(
   selectState,
    (state) => state.empresa
);


export const selectLogoEmpresa = createSelector(
    selectState,
    (state) => state.logo
);

export const selectOpcionesAsignadas = createSelector(
    selectState,
    (state) => state.opcionesAsignadas
);


export const selectOpcionesNoAsignadas = createSelector(
    selectState,
    (state) => state.opcionesNoAsignadas
);

