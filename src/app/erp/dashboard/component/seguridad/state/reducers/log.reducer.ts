import { createReducer, on } from '@ngrx/store';
import { Log } from '../interface/log.interface';
import * as LogActions from '../actions/log.actions';
import { DataStateLog } from '../../../app.state';

export interface LogState {
    log: Log[];
    error: string | null;
    loading: boolean;
}

export const initialLogState: DataStateLog = {
    log: [],
    error: null,
    loading: false
};

export const _logReducer = createReducer(
    initialLogState,
    on(LogActions.getLogSuccess, (state, { log }) => ({
        ...state,
        log
    })),
    on(LogActions.logError, (state, { error }) => ({
        ...state,
        error
    }))
);
