import { createAction, props } from '@ngrx/store';
import { GymSlot } from '../interface/gymSlot.interface';

export const getGymSlotRequest = createAction(
    '[GymSlot] Get GymSlot Request',
    props<{ branch_id?: number }>()
);

export const getGymSlotSuccess = createAction(
    '[GymSlot] Get GymSlot Success',
    props<{ gymSlot: GymSlot[] }>()
);

export const gymSlotError = createAction(
    '[GymSlot] GymSlot Error',
    props<{ error: string }>()
);
