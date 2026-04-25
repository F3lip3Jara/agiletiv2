import { createReducer, on } from '@ngrx/store';
import { GymReservation } from '../interface/gymReservation.interface';
import * as GymReservationActions from '../actions/gymReservation.actions';
import { DataStateGymReservation } from '../../../app.state';

export interface GymReservationState {
    gymReservation: GymReservation[];
    error: string | null;
    loading: boolean;
}

export const initialGymReservationState: GymReservationState = {
    gymReservation: [],
    error: null,
    loading: false
};

export const _gymReservationReducer = createReducer(
    initialGymReservationState,
    on(GymReservationActions.getGymReservationSuccess, (state, { gymReservation }) => ({
        ...state,
        gymReservation
    })),
    on(GymReservationActions.gymReservationError, (state, { error }) => ({
        ...state,
        error
    }))
);
