import { createAction, props } from '@ngrx/store';
import { GymBranch } from '../interface/gymBranch.interface';

export const getGymBranchRequest = createAction(
    '[GymBranch] Get GymBranch Request'
);

export const getGymBranchSuccess = createAction(
    '[GymBranch] Get GymBranch Success',
    props<{ gymBranch: GymBranch[] }>()
);

export const gymBranchError = createAction(
    '[GymBranch] GymBranch Error',
    props<{ error: string }>()
);
