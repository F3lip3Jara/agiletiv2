import { createAction, props } from '@ngrx/store';
import { Gym } from '../interface/gym.interface';

export const getGymRequest = createAction(
    '[Gym] Get Gym Request'
);

export const getGymSuccess = createAction(
    '[Gym] Get Gym Success',
    props<{ gym: Gym[] }>()
);

export const gymError = createAction(
    '[Gym] Gym Error',
    props<{ error: string }>()
);
