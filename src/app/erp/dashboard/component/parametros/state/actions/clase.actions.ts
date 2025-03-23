import { createAction, props } from '@ngrx/store';
import { Clase } from '../interface/clase.interface';

export const getClaseRequest = createAction(
    '[Clase] Get Clase Request'
);

export const getClaseSuccess = createAction(
    '[Clase] Get Clase Success',
    props<{ clase: Clase[] }>()
);

export const claseError = createAction(
    '[Clase] Clase Error',
    props<{ error: string }>()
);

export const createClaseRequest = createAction(
    '[Clase] Create Clase Request',
    props<{ clase: Clase }>()
);

export const createClaseSuccess = createAction(
    '[Clase] Create Clase Success',
   
);

export const updateClaseRequest = createAction(
    '[Clase] Update Clase Request',
    props<{ clase: Clase }>()
);

export const updateClaseSuccess = createAction(
    '[Clase] Update Clase Success'  
);





