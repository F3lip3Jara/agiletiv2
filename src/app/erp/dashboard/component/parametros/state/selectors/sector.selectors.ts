import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SectorState } from '../reducers/sector.reducer';

export const selectState = createFeatureSelector<SectorState>('sector');

export const selectSector = createSelector(
   selectState,
    (state) => state.sector
);

export const selectSectorError = createSelector(
   selectState,
    (state) => state.error
);
export const selectSectorById = createSelector(
    selectState,
    (state, props: { id: number }) => state.sector?.find((item) => item.sectorId === props.id)
);

