import { createAction, props } from '@ngrx/store';
import { Region } from '../interface/region.interface';

export const getRegionRequest = createAction(
    '[Region] Get Region Request'
);

export const getRegionSuccess = createAction(
    '[Region] Get Region Success',
    props<{ region: Region[] }>()
);

export const regionError = createAction(
    '[Region] Region Error',
    props<{ error: string }>()
);

export const uploadRegionRequest = createAction(
    '[Region] Upload Region Request',
    props<{ pais: any }>()
);

export const uploadRegionSuccess = createAction(
    '[Region] Upload Region Success'
);




