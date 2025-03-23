import { createAction, props } from '@ngrx/store';
import { Color } from '../interface/color.interface';

export const getColorRequest = createAction(
    '[Color] Get Color Request'
);

export const getColorSuccess = createAction(
    '[Color] Get Color Success',
    props<{ color: Color[] }>()
);

export const colorError = createAction(
    '[Color] Color Error',
    props<{ error: string }>()
);

export const createColorRequest = createAction(
    '[Color] Create Color Request',
    props<{ color: Color }>()
);


export const createColorSuccess = createAction(
    '[Color] Create Color Success'
);

export const updateColorRequest = createAction(
    '[Color] Update Color Request',
    props<{ color: Color }>()
);

export const updateColorSuccess = createAction(
    '[Color] Update Color Success'
);



