import { createAction, props } from '@ngrx/store';
import { ConfigField } from '../interface/configField.interface';

export const getConfigFieldRequest = createAction(
    '[ConfigField] Get ConfigField Request'
);

export const getConfigFieldSuccess = createAction(
    '[ConfigField] Get ConfigField Success',
    props<{ configField: ConfigField[] }>()
);

export const configFieldError = createAction(
    '[ConfigField] ConfigField Error',
    props<{ error: string }>()
);

export const updateConfigFieldRequest = createAction(
    '[ConfigField] Update ConfigField Request',
    props<{ configField: any }>()
);

export const updateConfigFieldSuccess = createAction(
    '[ConfigField] Update ConfigField Success',
   
);




