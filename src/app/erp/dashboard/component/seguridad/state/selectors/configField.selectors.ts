import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ConfigFieldState } from '../state/reducers/configField.reducer';

export const selectState = createFeatureSelector<ConfigFieldState>('configField');

export const selectConfigField = createSelector(
   selectState,
    (state) => state.configField
);

export const selectConfigFieldError = createSelector(
   selectState,
    (state) => state.error
);
export const selectConfigFieldById = createSelector(
    selectState,
    (state, props: { id: number }) => state.configField?.find((item) => item.configFieldId === props.id)
);

