import { createAction, props } from '@ngrx/store';
import { Grupo } from '../interface/grupo.interface';

export const getGrupoRequest = createAction(
    '[Grupo] Get Grupo Request'
);

export const getGrupoSuccess = createAction(
    '[Grupo] Get Grupo Success',
    props<{ grupo: Grupo[] }>()
);

export const grupoError = createAction(
    '[Grupo] Grupo Error',
    props<{ error: string }>()
);
