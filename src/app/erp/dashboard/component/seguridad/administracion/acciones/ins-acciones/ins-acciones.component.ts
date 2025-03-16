import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { Validators } from '@angular/forms';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { accionesError, accionesInsertRequest, accionesInsertSuccess } from '../../../state/actions/acciones.actions';
import { Actions, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-ins-acciones',
    templateUrl: './ins-acciones.component.html',
    styleUrl: './ins-acciones.component.scss',
    providers: [MessageService]
})
export class InsAccionesComponent {
    ins: FormGroup;
    opcion: any;
    val: boolean = false;

    constructor(
        fgUser: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private actions$: Actions,
        private messageService: MessageService
    ) {
        this.ins = fgUser.group({
            accDes: ['', Validators.compose([
                Validators.required
            ])],
            accUrl: ['', Validators.compose([
                Validators.required
            ])],
            accetaDes: ['', Validators.compose([])],
            accType: ['success', Validators.compose([
                Validators.required
            ])],
            accMessage: ['', Validators.compose([
                Validators.required
            ])]
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const obj = params['opcion'];
            this.opcion = JSON.parse(atob(obj));
        });
    }

    public guardar(accDes: string, accUrl: string, accetaDes: string, accType: string, accMessage: string) {
        let parametros = {
            accDes: accDes,
            accUrl: accUrl,
            accetaDes: accetaDes,
            accType: accType,
            accMessage: accMessage,
            optId: this.opcion.optId
        }
        this.val = true;
        this.store.dispatch(incrementarRequest({ request: 1 }));
        this.store.dispatch(accionesInsertRequest({ acciones: parametros }));

        // Suscribirse a la acción de éxito
        this.actions$.pipe(
            ofType(accionesInsertSuccess)
        ).subscribe(() => {    
          console.log('insert success');
           
            setTimeout(() => {
                this.val = false;
                this.router.navigate(['/desk/seguridad/administracion/opciones/acciones/' + btoa(JSON.stringify(this.opcion))]);
            }, 1000);
        });

        // Suscribirse a la acción de error
        this.actions$.pipe(
            ofType(accionesError)
        ).subscribe((error) => {
            this.val = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al guardar la acción'
            });
        });
    }

    volver() {
        let obj = btoa(JSON.stringify(this.opcion));
        this.router.navigate(['desk/seguridad/administracion/opciones/acciones/' + obj]);
    }
}
