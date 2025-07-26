import { createAction, props } from '@ngrx/store';
import { Log } from '../interface/log.interface';

export const getLogRequest = createAction(
    '[Log] Get Log Request'
);

export const getLogSuccess = createAction(
    '[Log] Get Log Success',
    props<{ log: Log[] }>()
);

export const logError = createAction(
    '[Log] Log Error',
    props<{ error: string }>()
);
