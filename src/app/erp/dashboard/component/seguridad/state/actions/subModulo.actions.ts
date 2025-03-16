import { createAction, props } from '@ngrx/store';
import { SubModulo } from '../interface/subModulo.interface';

export const getSubModuloRequest = createAction(
    '[SubModulo] Get SubModulo Request'
);

export const getSubModuloSuccess = createAction(
    '[SubModulo] Get SubModulo Success',
    props<{ subModulo: SubModulo[] }>()
);

export const subModuloError = createAction(
    '[SubModulo] SubModulo Error',
    props<{ error: string }>()
);
