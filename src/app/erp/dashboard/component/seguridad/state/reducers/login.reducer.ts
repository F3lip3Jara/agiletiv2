import { createReducer, on } from '@ngrx/store';
import { Login } from '../interface/login.interface';
import * as LoginActions from '../actions/login.actions';
import { DataStateLogin } from '../../../app.state';

export interface LoginState {
    login: Login[];
    error: string | null;
    loading: boolean;
}

export const initialLoginState: DataStateLogin = {
    login: [],
    error: null,
    loading: false
};

export const _loginReducer = createReducer(
    initialLoginState,
    on(LoginActions.getLoginSuccess, (state, { login }) => ({
        ...state,
        login
    })),
    on(LoginActions.loginError, (state, { error }) => ({
        ...state,
        error
    }))
);
