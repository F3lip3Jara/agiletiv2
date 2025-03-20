import { createSelector, createFeatureSelector } from '@ngrx/store';
import { RegionState } from '../reducers/region.reducer';

export const selectState = createFeatureSelector<RegionState>('region');

export const selectRegion = createSelector(
   selectState,
    (state) => state.region
);

export const selectRegionError = createSelector(
   selectState,
    (state) => state.error
);
export const selectRegionById = createSelector(
    selectState,
    (state, props: { id: number }) => state.region?.find((item) => item.regionId === props.id)
);

