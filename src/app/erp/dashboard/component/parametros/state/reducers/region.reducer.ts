import { createReducer, on } from '@ngrx/store';
import { Region } from '../interface/region.interface';
import * as RegionActions from '../actions/region.actions';
import { DataStateRegion } from '../../../app.state';

export interface RegionState {
    region: Region[];
    error: string | null;
    loading: boolean;
}

export const initialRegionState: DataStateRegion = {
    region: [],
    error: null,
    loading: false
};

export const _regionReducer = createReducer(
    initialRegionState,
    on(RegionActions.getRegionSuccess, (state, { region }) => ({
        ...state,
        region
    })),
    on(RegionActions.regionError, (state, { error }) => ({
        ...state,
        error
    })),

    on(RegionActions.getRegionesPaisSuccess, (state, { region }) => ({
        ...state,
        region
    }))
);
