import { createReducer, on } from '@ngrx/store';
import { ConfigField } from '../interface/configField.interface';
import * as ConfigFieldActions from '../actions/configField.actions';
import { DataStateConfigField } from '../../../app.state';

export interface ConfigFieldState {
    configField: ConfigField[];
    error: string | null;
    loading: boolean;
}

export const initialConfigFieldState: DataStateConfigField = {
    configField: [],
    error: null,
    loading: false
};

export const _configFieldReducer = createReducer(
    initialConfigFieldState,
    on(ConfigFieldActions.getConfigFieldSuccess, (state, { configField }) => ({
        ...state,
        configField
    })),
    on(ConfigFieldActions.configFieldError, (state, { error }) => ({
        ...state,
        error
    }))
);
