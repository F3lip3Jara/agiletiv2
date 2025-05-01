import { createReducer, on } from '@ngrx/store';
import { Sector } from '../interface/sector.interface';
import * as SectorActions from '../actions/sector.actions';
import {  DataStateSector } from '../../../app.state';

export interface SectorState {
    sector: Sector[];
    error: string | null;
    loading: boolean;
}

export const initialSectorState: DataStateSector = {
    sector: [],
    error: null,
    loading: false
};

export const _sectorReducer = createReducer(
    initialSectorState,
    on(SectorActions.getSectorSuccess, (state, { sector }) => ({
        ...state,
        sector
    })),
    on(SectorActions.sectorError, (state, { error }) => ({
        ...state,
        error
    }))
);
