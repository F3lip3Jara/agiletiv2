import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Producto } from '../../state/interface/producto.interface';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { getColorRequest, getColorSuccess } from '../../state/actions/color.actions';
import { getTallaRequest, getTallaSuccess } from '../../state/actions/talla.actions';
import { getGrupoRequest, getGrupoSuccess } from '../../state/actions/grupo.actions';
import { getSubgrupoRequest, getSubgrupoSuccess } from '../../state/actions/subgrupo.actions';
import { getUnidadRequest, getUnidadSuccess } from '../../state/actions/unidad.actions';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getProductoSuccess, updateProductoRequest, updateProductoSuccess} from '../../state/actions/producto.actions';
import { ActivatedRoute, Router } from '@angular/router';

interface AttributeItem {
    name: string;
    code: string;
    id: number;
}

@Component({
    selector: 'app-up-productos',
    templateUrl: './up-productos.component.html',
    styleUrl: './up-productos.component.scss'
})
export class UpProductosComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    up: FormGroup;
    loading: boolean = false;
    productoId: number = 0;
    producto: Producto = {
        id: 0,
        cod_pareo: '',
        descripcion: '',
        descripcion_corta: '',
        observaciones: '',
        cod_rapido: '',
        cod_barra: '',
        tipo: '',
        grupo: '',
        sub_grupo: '',
        color: '',
        moneda: 'CLP',
        costo: 0,
        neto: 0,
        bruto: 0,
        medida: '',
        peso: '',
        minimo: '',
        inventariable: '',
        id_ext: '',
        url: '',
        talla: '',
        alto: 0,
        ancho: 0,
        largo: 0,
        volumen: 0,
        created_at: '',
        updated_at: '',
        codcolor: '',
        codgrupo: '',
        codsubgrupo: '',
        codmedida: '',
        codtalla: ''
    };

    // Arrays para los atributos seleccionados
    colorSeleccionado: AttributeItem[] = [];
    tallaSeleccionada: AttributeItem[] = [];
    grupoSeleccionado: AttributeItem[] = [];
    subgrupoSeleccionado: AttributeItem[] = [];
    medidaSeleccionada: AttributeItem[] = [];

    tipos: any[] = [
        { name: 'Producto Físico', code: 'FISICO' },
        { name: 'Producto Digital', code: 'DIGITAL' },
        { name: 'Servicio', code: 'SERVICIO' }
    ];

    coloresDisponibles: AttributeItem[] = [];
    tallasDisponibles: AttributeItem[] = [];
    gruposDisponibles: AttributeItem[] = [];
    subgruposDisponibles: AttributeItem[] = [];
    medidasDisponibles: AttributeItem[] = [];

    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.initForm();
        
        // Obtener el ID del producto de la URL
        this.route.params.subscribe(params => {
            this.producto = JSON.parse(atob(params['producto']));  
            this.populateForm();
            
            
        });

        this.store.dispatch(incrementarRequest({request: 5}));
        
        // Dispatch all requests
        this.store.dispatch(getColorRequest());
        this.store.dispatch(getTallaRequest());
        this.store.dispatch(getGrupoRequest());
        this.store.dispatch(getSubgrupoRequest());
        this.store.dispatch(getUnidadRequest());

        // Subscribe to producto success
        this.actions$.pipe(
            ofType(getProductoSuccess),
            takeUntil(this.destroy$)
        ).subscribe((action: any) => {
            this.producto = action.producto;
            this.populateForm();
        });

        // Subscribe to color success
        this.actions$.pipe(
            ofType(getColorSuccess),
            takeUntil(this.destroy$)
        ).subscribe((action: any) => {
            this.coloresDisponibles = action.color.map((item: any) => ({
                name: item.colDes,
                code: item.colCod,
                id: item.colId
            }));
            this.initializeAttribute('color');
        });

        // Subscribe to talla success
        this.actions$.pipe(
            ofType(getTallaSuccess),
            takeUntil(this.destroy$)
        ).subscribe((action: any) => {
            this.tallasDisponibles = action.talla.map((item: any) => ({
                name: item.tallaDes,
                code: item.tallaCod,
                id: item.tallaId
            }));
            this.initializeAttribute('talla');
        });

        // Subscribe to grupo success
        this.actions$.pipe(
            ofType(getGrupoSuccess),
            takeUntil(this.destroy$)
        ).subscribe((action: any) => {
            this.gruposDisponibles = action.grupo.map((item: any) => ({
                name: item.grpDes,
                code: item.grpCod,
                id: item.grpId
            }));        
            this.initializeAttribute('grupo');
        });

        // Subscribe to subgrupo success
        this.actions$.pipe(
            ofType(getSubgrupoSuccess),
            takeUntil(this.destroy$)
        ).subscribe((action: any) => {
            this.subgruposDisponibles = action.subGrupo.map((item: any) => ({
                name: item.grpsDes,
                code: item.grpsCod,
                id: item.grpsId
            }));
            this.initializeAttribute('sub_grupo');
        });

        // Subscribe to unidad success
        this.actions$.pipe(
            ofType(getUnidadSuccess),
            takeUntil(this.destroy$)
        ).subscribe((action: any) => {
            this.medidasDisponibles = action.unidad.map((item: any) => ({
                name: item.unDes,
                code: item.unCod,
                id: item.unId
            }));
            this.initializeAttribute('medida');
        });

        // Subscribe to update success
        this.actions$.pipe(
            ofType(updateProductoSuccess),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.loading = false;
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeAttribute(type: string) {
        switch (type) {
            case 'color':
                if (this.producto.color && this.coloresDisponibles.length > 0) {
                    const colorItem = this.coloresDisponibles.find(c => c.code === this.producto.codcolor);
                    if (colorItem) {
                        this.colorSeleccionado = [colorItem];
                        this.coloresDisponibles = this.coloresDisponibles.filter(c => c.code !== this.producto.codcolor);
                        this.up.controls['color'].setValue(colorItem);
                        this.producto.color = colorItem;
                    }
                }
                break;
            case 'talla':
                if (this.producto.talla && this.tallasDisponibles.length > 0) {
                    const tallaItem = this.tallasDisponibles.find(t => t.code === this.producto.codtalla);
                    if (tallaItem) {
                        this.tallaSeleccionada = [tallaItem];
                        this.tallasDisponibles = this.tallasDisponibles.filter(t => t.code !== this.producto.codtalla);
                        this.up.controls['talla'].setValue(tallaItem);
                        this.producto.talla = tallaItem;
                    }
                }
                break;
            case 'grupo':
                if (this.producto.grupo && this.gruposDisponibles.length > 0) {
                    const grupoItem = this.gruposDisponibles.find(g => g.code === this.producto.codgrupo);
                    if (grupoItem) {
                        this.grupoSeleccionado = [grupoItem];
                        this.gruposDisponibles = this.gruposDisponibles.filter(g => g.code !== this.producto.codgrupo);
                        this.up.controls['grupo'].setValue(grupoItem);
                        this.producto.grupo = grupoItem;
                    }
                }
                break;
            case 'sub_grupo':
                if (this.producto.sub_grupo && this.subgruposDisponibles.length > 0) {
                    const subgrupoItem = this.subgruposDisponibles.find(s => s.code === this.producto.codsubgrupo);
                    if (subgrupoItem) {
                        this.subgrupoSeleccionado = [subgrupoItem];
                        this.subgruposDisponibles = this.subgruposDisponibles.filter(s => s.code !== this.producto.codsubgrupo);
                        this.up.controls['sub_grupo'].setValue(subgrupoItem);   
                        this.producto.sub_grupo = subgrupoItem;
                    }
                }
                break;
            case 'medida':
                if (this.producto.medida && this.medidasDisponibles.length > 0) {
                    const medidaItem = this.medidasDisponibles.find(m => m.code === this.producto.codmedida);
                    if (medidaItem) {
                        this.medidaSeleccionada = [medidaItem];
                        this.medidasDisponibles = this.medidasDisponibles.filter(m => m.code !== this.producto.codmedida);
                        this.up.controls['medida'].setValue(medidaItem);
                        this.producto.medida = medidaItem;
                    }
                }
                break;
        }
    }

    private populateForm() {
        // Datos básicos del producto
        this.up.patchValue({
            descripcion: this.producto.descripcion,
            observaciones: this.producto.observaciones,
            cod_pareo: this.producto.cod_pareo,
            cod_rapido: this.producto.cod_rapido,
            cod_barra: this.producto.cod_barra,
            tipo: this.tipos.find(t => t.code === this.producto.tipo),
            costo: this.producto.costo,
            neto: this.producto.neto,
            bruto: this.producto.bruto,
            minimo: this.producto.minimo,
            inventariable: this.producto.inventariable === '1',
            alto: parseFloat(this.producto.alto?.toString() || '0'),
            ancho: parseFloat(this.producto.ancho?.toString() || '0'),
            largo: parseFloat(this.producto.largo?.toString() || '0'),
            volumen: parseFloat(this.producto.volumen?.toString() || '0'),
            peso: parseFloat(this.producto.peso) || 0,
            grupo: '',
            sub_grupo: '',
            color: '',
            talla: '',
            medida: ''
        });

        // Calcular volumen después de establecer las dimensiones
        this.calcularVolumen();
    }

    drop(event: CdkDragDrop<AttributeItem[]>, type: string) {       
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            if (event.container.data.length < 1) {
                transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex
                );
                const item: any = event.container.data[0];
                switch (type) {
                    case 'color':
                        this.producto.color = item;
                        this.up.patchValue({ color: item.code });
                        break;
                    case 'talla':
                        this.producto.talla = item;
                        this.up.patchValue({ talla: item.code });
                        break;
                    case 'grupo':
                        this.producto.grupo = item;
                        this.up.patchValue({ grupo: item.code });
                        break;
                    case 'sub_grupo':
                        this.producto.sub_grupo = item;
                        this.up.patchValue({ sub_grupo: item.code });
                        break;
                    case 'medida':
                        this.producto.medida = item;
                        this.up.patchValue({ medida: item.code });
                        break;
                }
            } else {
                const [itemToMove] = event.previousContainer.data.splice(event.previousIndex, 1);
                const [itemToReturn] = event.container.data.splice(0, 1);
                
                event.previousContainer.data.push(itemToReturn);
                event.container.data.push(itemToMove);

                const item: any = event.container.data[0];
                switch (type) {
                    case 'color':
                        this.producto.color = item;
                        this.up.patchValue({ color: item.code });
                        break;
                    case 'talla':
                        this.producto.talla = item;
                        this.up.patchValue({ talla: item.code });
                        break;
                    case 'grupo':
                        this.producto.grupo = item;
                        this.up.patchValue({ grupo: item.code });
                        break;
                    case 'sub_grupo':
                        this.producto.sub_grupo = item;
                        this.up.patchValue({ sub_grupo: item.code });
                        break;
                    case 'medida':
                        this.producto.medida = item;
                        this.up.patchValue({ medida: item.code });
                        break;
                }
            }
        }
    }

    actualizarPrecio() {
        this.producto.bruto = this.producto.neto * 1.19;
    }

    calcularVolumen() {
        const alto = this.up.get('alto')?.value || 0;
        const ancho = this.up.get('ancho')?.value || 0;
        const largo = this.up.get('largo')?.value || 0;

        if (alto > 0 && ancho > 0 && largo > 0) {
            const volumen = alto * ancho * largo;
            this.up.patchValue({ volumen: volumen });
            this.producto.volumen = volumen;
        } else {
            this.up.patchValue({ volumen: 0 });
            this.producto.volumen = 0;
        }

        this.up.get('alto')?.markAsTouched();
        this.up.get('ancho')?.markAsTouched();
        this.up.get('largo')?.markAsTouched();
    }

    actualizar() {
        if(this.up.valid) {
            this.producto.alto = this.up.value.alto;
            this.producto.ancho = this.up.value.ancho;
            this.producto.largo = this.up.value.largo;
            this.producto.volumen = this.up.value.volumen; 
            this.producto.descripcion = this.up.value.descripcion;
            this.producto.descripcion_corta = this.up.value.descripcion_corta;
            this.producto.observaciones = this.up.value.observaciones;
            this.producto.cod_pareo = this.up.value.cod_pareo;
            this.producto.cod_rapido = this.up.value.cod_rapido;
            this.producto.cod_barra = this.up.value.cod_barra;
            this.producto.tipo = this.up.value.tipo;
            this.producto.costo = this.up.value.costo;
            this.producto.neto = this.up.value.neto;
            this.producto.bruto = this.up.value.bruto;
            this.producto.minimo = this.up.value.minimo;
            this.producto.inventariable = this.up.value.inventariable;
            this.producto.peso = this.up.value.peso;
            
            
            this.store.dispatch(incrementarRequest({request: 1}));
            this.store.dispatch(updateProductoRequest({producto: this.producto}));
            this.loading = true;

            this.actions$.pipe(
                ofType(updateProductoSuccess),
                takeUntil(this.destroy$)
            ).subscribe(() => {
                setTimeout(() => {
                    this.loading = false;
                    this.router.navigate(['desk/parametros/productos']);
                }, 1000);   
            });
          
        }
    }

    private initForm() {
        this.up = this.fb.group({
            descripcion: ['', [Validators.required]],
            observaciones: [''],
            cod_pareo: ['', [Validators.required]],
            cod_rapido: ['', [Validators.required]],
            cod_barra: ['', [Validators.required]],
            tipo: ['', [Validators.required]],
            costo: [0, [Validators.required, Validators.min(1)]],
            neto: [0, [Validators.required, Validators.min(1)]],
            bruto: [0, [Validators.required, Validators.min(1)]],
            minimo: [0, [Validators.required, Validators.min(1)]],
            inventariable: [false],
            alto: [0, [Validators.required, Validators.min(0.01)]],
            ancho: [0, [Validators.required, Validators.min(0.01)]],
            largo: [0, [Validators.required, Validators.min(0.01)]],
            volumen: [0],
            peso: [0, [Validators.required, Validators.min(0.01)]],
            grupo: ['', [Validators.required]],
            sub_grupo: ['', [Validators.required]],
            color: ['', [Validators.required]],
            talla: ['', [Validators.required]],
            medida: ['', [Validators.required]]
        });

        const dimensiones = ['alto', 'ancho', 'largo'];
        dimensiones.forEach(dimension => {
            this.up.get(dimension)?.valueChanges.subscribe(() => {
                this.calcularVolumen();
            });
        });
    }

    onEditorInit(event: any) {
        const editor = document.getElementsByClassName('ql-editor');
        if (editor && editor.length > 0) {
            const firstP = editor[0].querySelector('p'); // Selecciona el primer <p>
            if (firstP) {
                const text = this.stripHtml(this.producto.observaciones);
                firstP.innerText = text; // Modifica el texto del <p>
            }
        }
      
    }

     stripHtml(html: string): string {
        const div = document.createElement("div"); // Crear un elemento temporal
        div.innerHTML = html; // Asignar el HTML recibido
        return div.innerText || div.textContent || ""; // Obtener solo el texto
    }
}
