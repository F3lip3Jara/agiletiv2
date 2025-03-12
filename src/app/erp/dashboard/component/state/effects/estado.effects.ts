import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';


@Injectable()
export class EstadoEffects {

  constructor(private actions$: Actions) {
    }

 
}