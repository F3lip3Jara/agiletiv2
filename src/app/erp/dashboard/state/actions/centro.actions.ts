import { createAction, props } from '@ngrx/store';
import { Centro } from '../../component/parametros/state/interface/centro.interface';

export const createCentroRequest = createAction(
    '[Centro] Create Centro Request',
    props<{ centro: Centro }>()
);

export const createCentroSuccess = createAction(
    '[Centro] Create Centro Success',
    props<{ centro: Centro }>()
);

export const CentroError = createAction(
    '[Centro] Centro Error',
    props<{ error: any }>()
);

export const getCentroRequest = createAction(
    '[Centro] Get Centro Request'
);

export const getCentroSuccess = createAction(
    '[Centro] Get Centro Success',
    props<{ centros: Centro[] }>()
);

export const updateCentroRequest = createAction(
    '[Centro] Update Centro Request',
    props<{ centro: Centro }>()
);

export const updateCentroSuccess = createAction(
    '[Centro] Update Centro Success',
    props<{ centro: Centro }>()
);

export const deleteCentroRequest = createAction(
    '[Centro] Delete Centro Request',
    props<{ centroId: number }>()
);

export const deleteCentroSuccess = createAction(
    '[Centro] Delete Centro Success',
    props<{ centroId: number }>()
);
