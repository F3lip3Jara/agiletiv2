import { createAction, props } from '@ngrx/store';
import { GymReservation } from '../interface/gymReservation.interface';

export const getGymReservationRequest = createAction(
    '[GymReservation] Get GymReservation Request'
);

export const getGymReservationSuccess = createAction(
    '[GymReservation] Get GymReservation Success',
    props<{ gymReservation: GymReservation[] }>()
);

export const gymReservationError = createAction(
    '[GymReservation] GymReservation Error',
    props<{ error: string }>()
);
