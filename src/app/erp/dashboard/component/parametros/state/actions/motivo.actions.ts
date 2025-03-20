import { createAction, props } from '@ngrx/store';
import { Motivo } from '../interface/motivo.interface';

export const getMotivoRequest = createAction(
    '[Motivo] Get Motivo Request'
);

export const getMotivoSuccess = createAction(
    '[Motivo] Get Motivo Success',
    props<{ motivo: Motivo[] }>()
);

export const motivoError = createAction(
    '[Motivo] Motivo Error',
    props<{ error: string }>()
);
