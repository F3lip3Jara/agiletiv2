import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ProveedorServices } from '../service/proveedor.service';
import * as ProveedorActions from '../actions/proveedor.actions';

@Injectable()
export class ProveedorEffects {
    constructor(
        private actions: Actions,
        private proveedorService: ProveedorServices
    ) {}

    getProveedor = createEffect(() => this.actions.pipe(
        ofType(ProveedorActions.getProveedorRequest),
        switchMap(() => this.proveedorService.getProveedor()
            .pipe(
                map(proveedor => ProveedorActions.getProveedorSuccess({ proveedor })),
                catchError(error => of(ProveedorActions.proveedorError({ error: error.message })))
            ))
    ));
}
