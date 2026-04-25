import { createReducer, on } from '@ngrx/store';
import { Gym } from '../interface/gym.interface';
import * as GymActions from '../actions/gym.actions';


export interface GymState {
    gym: Gym[];
    error: string | null;
    loading: boolean;
}

export const initialGymState: GymState = {
    gym: [],
    error: null,
    loading: false
};

export const _gymReducer = createReducer(
    initialGymState,
    on(GymActions.getGymSuccess, (state, { gym }) => ({
        ...state,
        gym
    })),
    on(GymActions.gymError, (state, { error }) => ({
        ...state,
        error
    }))
);
