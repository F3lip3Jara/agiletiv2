import { createReducer, on } from '@ngrx/store';
import { Color } from '../interface/color.interface';
import * as ColorActions from '../actions/color.actions';
import { DataStateColor } from '../../../app.state';

export interface ColorState {
    color: Color[];
    error: string | null;
    loading: boolean;
}

export const initialColorState: DataStateColor = {
    color: [],
    error: null,
    loading: false
};

export const _colorReducer = createReducer(
    initialColorState,
    on(ColorActions.getColorSuccess, (state, { color }) => ({
        ...state,
        color
    })),
    on(ColorActions.colorError, (state, { error }) => ({
        ...state,
        error
    }))
);
