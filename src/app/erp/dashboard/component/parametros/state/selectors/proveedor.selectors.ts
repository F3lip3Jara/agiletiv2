import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProveedorState } from '../reducers/proveedor.reducer';

export const selectState = createFeatureSelector<ProveedorState>('proveedor');

export const selectProveedor = createSelector(
   selectState,
    (state) => state.proveedor
);

export const selectProveedorError = createSelector(
   selectState,
    (state) => state.error
);
export const selectProveedorById = createSelector(
    selectState,
    (state, props: { id: number }) => state.proveedor?.find((item) => item.proveedorId === props.id)
);

