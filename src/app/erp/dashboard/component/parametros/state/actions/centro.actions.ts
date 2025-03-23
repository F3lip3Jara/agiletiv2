import { createAction, props } from '@ngrx/store';
import { Centro } from '../interface/centro.interface';

export const getCentroRequest = createAction(
    '[Centro] Get Centro Request'
);

export const getCentroSuccess = createAction(
    '[Centro] Get Centro Success',
    props<{ centro: Centro[] }>()
);

export const centroError = createAction(
    '[Centro] Centro Error',
    props<{ error: string }>()
);

export const createCentroRequest = createAction(
    '[Centro] Create Centro Request',
    props<{ centro: Centro }>()
);

export const createCentroSuccess = createAction(
    '[Centro] Create Centro Success'
);

export const updateCentroRequest = createAction(
    '[Centro] Update Centro Request',
    props<{ centro: Centro }>()
);

export const updateCentroSuccess = createAction(
    '[Centro] Update Centro Success'
);







