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
