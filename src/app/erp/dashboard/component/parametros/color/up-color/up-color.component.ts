import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { distinctUntilChanged, take, debounceTime } from 'rxjs';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { updateColorRequest, updateColorSuccess } from '../../state/actions/color.actions';
import { getColorInfoSuccess, getColorInfoRequest } from '../../../seguridad/state/actions/acciones.actions';

declare global {
    interface Window {
        EyeDropper?: new () => EyeDropper;
    }
    
    interface EyeDropper {
        open: () => Promise<{ sRGBHex: string }>;
    }
}

@Component({
  selector: 'app-up-color',
  templateUrl: './up-color.component.html',
  styleUrl: './up-color.component.scss'
})
export class UpColorComponent implements OnInit {
    up: FormGroup;
    val: boolean = false;
    displayColorPicker: boolean = false;
    selectedColorInfo: any | null = null;
    colorData: any;
    valColor: boolean = false;
    isEyeDropperSupported: boolean = false;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private fb: FormBuilder,
        private actions$: Actions,
        private route: ActivatedRoute
    ) {
        this.isEyeDropperSupported = typeof window !== 'undefined' && 'EyeDropper' in window;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.colorData = JSON.parse(atob(params['color']));
        });

        this.up = this.fb.group({
            colId: [this.colorData?.colId || '', Validators.required],
            colCod: [this.colorData?.colCod || '#FFFFFF', Validators.required],
            colDes: [this.colorData?.colDes || '', Validators.required],
        });

        // Observar cambios en el código de color
        this.up.controls['colCod'].valueChanges.pipe(
            debounceTime(1500),
            distinctUntilChanged()
        ).subscribe((value: string) => {
            this.valColor = true;
            this.store.dispatch(getColorInfoRequest({colCod: value}));
            this.actions$.pipe(
                ofType(getColorInfoSuccess),
                take(1)
            ).subscribe((colorInfo: any) => {
                this.valColor = false;
                this.selectedColorInfo = colorInfo;
                this.up.controls['colDes'].setValue(this.selectedColorInfo.colorInfo.name);
            }),
            (error: any) => {
                this.valColor = false;
                console.error('Error al obtener información del color:', error);
            }
        });
    }

    showColorDialog() {
        this.displayColorPicker = true;
    }

    onColorChange(event: any) {
        const hexColor = event.value;
        this.up.patchValue({
            colCod: hexColor
        });
    }

    async openEyeDropper() {
        if (!this.isEyeDropperSupported) {
            console.warn('EyeDropper API no está soportada en este navegador');
            return;
        }

        try {
            const eyeDropper = new window.EyeDropper!();
            const result = await eyeDropper.open();
            this.up.patchValue({
                colCod: result.sRGBHex
            });
        } catch (error) {
            console.error('Error al usar el EyeDropper:', error);
        }
    }

    public actualizar() {
        if(this.up.valid) {
            this.val = true;
            this.store.dispatch(incrementarRequest({request: 1}));
            this.store.dispatch(updateColorRequest({color: this.up.value}));
            this.actions$.pipe(
                ofType(updateColorSuccess),
                take(1)
            ).subscribe(() => {
                setTimeout(() => {
                    this.router.navigate(['/desk/parametros/color']);
                }, 1000);
            });
        }
    }
}
