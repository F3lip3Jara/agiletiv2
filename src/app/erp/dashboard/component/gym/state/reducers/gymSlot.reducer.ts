import { createReducer, on } from '@ngrx/store';
import { GymSlot } from '../interface/gymSlot.interface';
import * as GymSlotActions from '../actions/gymSlot.actions';

export interface GymSlotState {
    gymSlot: GymSlot[];
    error: string | null;
    loading: boolean;
}

export const initialGymSlotState: GymSlotState = {
    gymSlot: [],
    error: null,
    loading: false,
};

export const _gymSlotReducer = createReducer(
    initialGymSlotState,
    on(GymSlotActions.getGymSlotSuccess, (state, { gymSlot }) => ({
        ...state,
        gymSlot,
    })),
    on(GymSlotActions.gymSlotError, (state, { error }) => ({
        ...state,
        error,
    })),
);
