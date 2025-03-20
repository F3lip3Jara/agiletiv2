import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ColorState } from '../reducers/color.reducer';

export const selectState = createFeatureSelector<ColorState>('color');

export const selectColor = createSelector(
   selectState,
    (state) => state.color
);

export const selectColorError = createSelector(
   selectState,
    (state) => state.error
);
export const selectColorById = createSelector(
    selectState,
    (state, props: { id: number }) => state.color?.find((item) => item.colorId === props.id)
);

