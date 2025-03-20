import { createAction, props } from '@ngrx/store';
import { Subgrupo } from '../interface/subgrupo.interface';

export const getSubgrupoRequest = createAction(
    '[Subgrupo] Get Subgrupo Request'
);

export const getSubgrupoSuccess = createAction(
    '[Subgrupo] Get Subgrupo Success',
    props<{ subGrupo: Subgrupo[] }>()
);

export const subgrupoError = createAction(
    '[Subgrupo] Subgrupo Error',
    props<{ error: string }>()
);
