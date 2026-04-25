import { createReducer, on } from '@ngrx/store';
import { GymBranch } from '../interface/gymBranch.interface';
import * as GymBranchActions from '../actions/gymBranch.actions';


export interface GymBranchState {
    gymBranch: GymBranch[];
    error: string | null;
    loading: boolean;
}

export const initialGymBranchState: GymBranchState = {
    gymBranch: [],
    error: null,
    loading: false
};

export const _gymBranchReducer = createReducer(
    initialGymBranchState,
    on(GymBranchActions.getGymBranchSuccess, (state, { gymBranch }) => ({
        ...state,
        gymBranch
    })),
    on(GymBranchActions.gymBranchError, (state, { error }) => ({
        ...state,
        error
    }))
);
