import { createAction, props } from '@ngrx/store';
import { Sector } from '../interface/sector.interface';

export const getSectorRequest = createAction(
    '[Sector] Get Sector Request',
    props<{ almacen: any }>()
);

export const getSectorSuccess = createAction(
    '[Sector] Get Sector Success',
    props<{ sector: Sector[] }>()
);

export const sectorError = createAction(
    '[Sector] Sector Error',
    props<{ error: string }>()
);

export const createSectorRequest = createAction(
    '[Sector] Create Sector Request',
    props<{ sector: any }>()
);

export const createSectorSuccess = createAction(
    '[Sector] Create Sector Success'
);

export const updateSectorRequest = createAction(
    '[Sector] Update Sector Request',
    props<{ sector: any }>()
);

export const updateSectorSuccess = createAction(
    '[Sector] Update Sector Success'
);








