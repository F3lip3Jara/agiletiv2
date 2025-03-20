import { createAction, props } from '@ngrx/store';
import { Tipospagos } from '../interface/tipospagos.interface';

export const getTipospagosRequest = createAction(
    '[Tipospagos] Get Tipospagos Request'
);

export const getTipospagosSuccess = createAction(
    '[Tipospagos] Get Tipospagos Success',
    props<{ tipospagos: Tipospagos[] }>()
);

export const tipospagosError = createAction(
    '[Tipospagos] Tipospagos Error',
    props<{ error: string }>()
);
