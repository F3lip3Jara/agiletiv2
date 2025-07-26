import { createAction, props } from '@ngrx/store';
import { Login } from '../interface/login.interface';

export const getLoginRequest = createAction(
    '[Login] Get Login Request'
);

export const getLoginSuccess = createAction(
    '[Login] Get Login Success',
    props<{ login: Login[] }>()
);

export const loginError = createAction(
    '[Login] Login Error',
    props<{ error: string }>()
);
