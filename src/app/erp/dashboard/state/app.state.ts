import { ActionReducerMap } from '@ngrx/store';
import { estadoReducer } from './reducers/estado.reducer';
import { centroReducer, CentroState } from './reducers/centro.reducer';

export interface AppState {
    estado: number;
    centro: CentroState;
}

export const reducers: ActionReducerMap<AppState> = {
    estado: estadoReducer,
    centro: centroReducer
}; 