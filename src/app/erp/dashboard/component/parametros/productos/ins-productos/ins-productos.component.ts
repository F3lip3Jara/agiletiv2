import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { createProductoRequest, createProductoSuccess } from '../../state/actions/producto.actions';
import { Router } from '@angular/router';
interface AttributeItem {
    name: string;
    code: string;
    id: number;
}

@Component({
    selector: 'app-ins-productos',
    templateUrl: './ins-productos.component.html',
    styleUrl: './ins-productos.component.scss'
})
export class InsProductosComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    ins: FormGroup;
    loading: boolean = false;
    imageLoaded: boolean = false;
    imageError: boolean = false;
    previewVisible: boolean = false;
    val: boolean = false;
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
        private router: Router
    ) {}

    ngOnInit() {
        this.initForm();
        this.store.dispatch(incrementarRequest({request: 5}));
        
        // Dispatch all requests
        this.store.dispatch(getColorRequest());
        this.store.dispatch(getTallaRequest());
        this.store.dispatch(getGrupoRequest());
        this.store.dispatch(getSubgrupoRequest());
        this.store.dispatch(getUnidadRequest());

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
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeAttribute(type: string) {
        switch (type) {
            case 'color':
                if (this.producto.color && this.coloresDisponibles.length > 0) {
                    const colorItem = this.coloresDisponibles.find(c => c.code === this.producto.color);
                    if (colorItem) {                        
                        this.colorSeleccionado = [colorItem];
                        this.coloresDisponibles = this.coloresDisponibles.filter(c => c.code !== this.producto.color);
                    }
                }
                break;
            case 'talla':
                if (this.producto.talla && this.tallasDisponibles.length > 0) {
                    const tallaItem = this.tallasDisponibles.find(t => t.code === this.producto.talla);
                    if (tallaItem) {
                        this.tallaSeleccionada = [tallaItem];
                        this.tallasDisponibles = this.tallasDisponibles.filter(t => t.code !== this.producto.talla);
                    }
                }
                break;
            case 'grupo':
                if (this.producto.grupo && this.gruposDisponibles.length > 0) {
                    const grupoItem = this.gruposDisponibles.find(g => g.code === this.producto.grupo);
                    if (grupoItem) {
                        this.grupoSeleccionado = [grupoItem];
                        this.gruposDisponibles = this.gruposDisponibles.filter(g => g.code !== this.producto.grupo);
                    }
                }
                break;
            case 'sub_grupo':
                if (this.producto.sub_grupo && this.subgruposDisponibles.length > 0) {
                    const subgrupoItem = this.subgruposDisponibles.find(s => s.code === this.producto.sub_grupo);
                    if (subgrupoItem) {
                        this.subgrupoSeleccionado = [subgrupoItem];
                        this.subgruposDisponibles = this.subgruposDisponibles.filter(s => s.code !== this.producto.sub_grupo);
                    }
                }
                break;
            case 'medida':
                if (this.producto.medida && this.medidasDisponibles.length > 0) {
                    const medidaItem = this.medidasDisponibles.find(m => m.code === this.producto.medida);
                    if (medidaItem) {
                        this.medidaSeleccionada = [medidaItem];
                        this.medidasDisponibles = this.medidasDisponibles.filter(m => m.code !== this.producto.medida);
                    }
                }
                break;
        }
    }

    drop(event: CdkDragDrop<AttributeItem[]>, type: string) {       
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            // Si el contenedor destino está vacío o tiene menos de 1 elemento
            if (event.container.data.length < 1) {
                transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex
                );
                // Actualizar el producto y el formulario con el nuevo valor
                const item: any = event.container.data[0];
           
                switch (type) {
                    case 'color':                   
                        this.producto.color = item;
                        this.ins.patchValue({ color: item.code });
                        break;
                    case 'talla':
                   
                        this.producto.talla = item;
                        this.ins.patchValue({ talla: item.code });
                        break;
                    case 'grupo':
                   
                        this.producto.grupo = item;
                        this.ins.patchValue({ grupo: item.code });
                        break;
                    case 'sub_grupo':
                   
                        this.producto.sub_grupo = item;
                        this.ins.patchValue({ sub_grupo: item.code });
                        break;
                    case 'medida':
                   
                        this.producto.medida = item;
                        this.ins.patchValue({ medida: item.code });
                        break;
                }
            } else {
                // Si ya hay un elemento en el contenedor destino, intercambiar los elementos
                const [itemToMove] = event.previousContainer.data.splice(event.previousIndex, 1);
                const [itemToReturn] = event.container.data.splice(0, 1);
                
                event.previousContainer.data.push(itemToReturn);
                event.container.data.push(itemToMove);

                // Actualizar el producto y el formulario con el nuevo valor
                const item: any = event.container.data[0];
                switch (type) {
                    case 'color':                   
                        this.producto.color = item;
                        this.ins.patchValue({ color: item.code });
                        break;
                    case 'talla':
                        this.producto.talla = item;
                        this.ins.patchValue({ talla: item.code });
                        break;
                    case 'grupo':
                   
                        this.producto.grupo = item;
                        this.ins.patchValue({ grupo: item.code });
                        break;
                    case 'sub_grupo':
                   
                        this.producto.sub_grupo = item;
                        this.ins.patchValue({ sub_grupo: item.code });
                        break;
                    case 'medida':
                        this.producto.medida = item;
                        this.ins.patchValue({ medida: item.code });
                        break;
                }
            }
        }
    }

    getAttributeLabel(code: string, type: string): string {
        const collections = {
            'colores': this.coloresDisponibles,
            'tallas': this.tallasDisponibles,
            'grupos': this.gruposDisponibles,
            'subgrupos': this.subgruposDisponibles,
            'medidas': this.medidasDisponibles
        };
        const item = collections[type].find(item => item.code === code);
        return item ? item.name : code;
    }

    getAttributeCode(code: string, type: string): string {
        if (type === 'colores') {
            const color = this.coloresDisponibles.find(item => item.code === code);
            return color ? color.code : '';
        }
        return '';
    }


    actualizarPrecio() {
        this.producto.bruto = this.producto.neto * 1.19;
    }

    calcularVolumen() {
        const alto = this.ins.get('alto')?.value || 0;
        const ancho = this.ins.get('ancho')?.value || 0;
        const largo = this.ins.get('largo')?.value || 0;

        if (alto > 0 && ancho > 0 && largo > 0) {
            const volumen = alto * ancho * largo;
            this.ins.patchValue({ volumen: volumen });
            this.producto.volumen = volumen;
        } else {
            this.ins.patchValue({ volumen: 0 });
            this.producto.volumen = 0;
        }

        // Marcar los campos como touched para mostrar validaciones
        this.ins.get('alto')?.markAsTouched();
        this.ins.get('ancho')?.markAsTouched();
        this.ins.get('largo')?.markAsTouched();
    }

    guardar() {
        if(this.ins.valid){
            this.producto.alto = this.ins.value.alto;
            this.producto.ancho = this.ins.value.ancho;
            this.producto.largo = this.ins.value.largo;
            this.producto.volumen = this.ins.value.volumen; 
            this.producto.descripcion = this.ins.value.descripcion;
            this.producto.descripcion_corta = this.ins.value.descripcion_corta;
            this.producto.observaciones = this.ins.value.observaciones;
            this.producto.cod_pareo = this.ins.value.cod_pareo;
            this.producto.cod_rapido = this.ins.value.cod_rapido;
            this.producto.cod_barra = this.ins.value.cod_barra;
            this.producto.tipo = this.ins.value.tipo;
            this.producto.costo = this.ins.value.costo;
            this.producto.neto = this.ins.value.neto;
            this.producto.bruto = this.ins.value.bruto;
            this.producto.minimo = this.ins.value.minimo;
            this.producto.inventariable = this.ins.value.inventariable;
            this.producto.peso = this.ins.value.peso;
            this.producto.url = this.ins.value.url;
            this.store.dispatch(incrementarRequest({request: 1}));
            this.store.dispatch(createProductoRequest({producto: this.producto}));
            this.loading = true;
            this.actions$.pipe(
                ofType(createProductoSuccess),
                takeUntil(this.destroy$)
            ).subscribe((action: any) => {
                setTimeout(() => {
                    this.loading = false;
                    this.router.navigate(['desk/parametros/productos']);
                }, 1000);   
            });
        }
    
      
    }

    private initForm() {
        this.ins = this.fb.group({
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
            medida: ['', [Validators.required]],
            url: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]]
        });

        // Suscribirse a cambios en las dimensiones
        const dimensiones = ['alto', 'ancho', 'largo'];
        dimensiones.forEach(dimension => {
            this.ins.get(dimension)?.valueChanges.subscribe(() => {
                this.calcularVolumen();
            });
        });
    }

    validarURL() {
        const urlControl = this.ins.get('url');
        if (urlControl?.valid) {
            this.imageLoaded = true;
            this.imageError = false;
        }
    }

    onImageLoad() {
        this.imageLoaded = true;
        this.imageError = false;
    }

    onImageError() {
        this.imageLoaded = false;
        this.imageError = true;
    }

    showPreview() {
        console.log(this.ins.get('url')?.value);
        console.log(this.ins.get('url')?.valid);
        console.log(this.imageError);
        console.log(this.imageLoaded);
        if (this.ins.get('url')?.valid && this.ins.get('url')?.value) {
            this.previewVisible = true;
        }
    }
} 
