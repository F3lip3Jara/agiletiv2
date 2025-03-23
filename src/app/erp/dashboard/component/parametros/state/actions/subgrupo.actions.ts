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

export const createSubgrupoRequest = createAction(
    '[Subgrupo] Create Subgrupo Request',
    props<{ subgrupo: Subgrupo }>()
);


export const createSubgrupoSuccess = createAction(
    '[Subgrupo] Create Subgrupo Success'
);

export const updateSubgrupoRequest = createAction(
    '[Subgrupo] Update Subgrupo Request',
    props<{ subgrupo: Subgrupo }>()
);

export const updateSubgrupoSuccess = createAction(
    '[Subgrupo] Update Subgrupo Success'
);







