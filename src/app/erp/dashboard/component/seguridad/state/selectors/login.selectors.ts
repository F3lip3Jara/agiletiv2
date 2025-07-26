import { createSelector, createFeatureSelector } from '@ngrx/store';
import { LoginState } from '../reducers/login.reducer';

export const selectState = createFeatureSelector<LoginState>('login');

export const selectLogin = createSelector(
   selectState,
    (state) => state.login
);

export const selectLoginError = createSelector(
   selectState,
    (state) => state.error
);
export const selectLoginById = createSelector(
    selectState,
    (state, props: { id: number }) => state.login?.find((item) => item.loginId === props.id)
);

