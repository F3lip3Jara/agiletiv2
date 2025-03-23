import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Router } from '@angular/router';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Environment } from 'src/app/erp/service/environment.service';
import { Centro } from '../../state/interface/centro.interface';
import { createCentroRequest, createCentroSuccess } from '../../state/actions/centro.actions';
declare global {
    interface Window {
        google: typeof google;
    }
}

@Component({
  selector: 'app-ins-centro',
  templateUrl: './ins-centro.component.html',
  styleUrl: './ins-centro.component.scss'
})
export class InsCentroComponent implements OnInit {
    @ViewChild('map') mapElement!: ElementRef;
    @ViewChild('cenDir') cenDirInput!: ElementRef;
    private environment = new Environment();
   
    centro: Centro;
    map: google.maps.Map | null = null;
    marker: any = null;
    autocomplete: google.maps.places.Autocomplete | null = null;
    estados = [
        { label: 'Activo', value: 'A' },
        { label: 'Inactivo', value: 'I' }
    ];

    diasSemana = [
        { label: 'L', value: 'LUN', icon: 'pi pi-calendar' },
        { label: 'M', value: 'MAR', icon: 'pi pi-calendar' },
        { label: 'M', value: 'MIE', icon: 'pi pi-calendar' },
        { label: 'J', value: 'JUE', icon: 'pi pi-calendar' },
        { label: 'V', value: 'VIE', icon: 'pi pi-calendar' },
        { label: 'S', value: 'SAB', icon: 'pi pi-calendar' },
        { label: 'D', value: 'DOM', icon: 'pi pi-calendar' }
    ];
    
    ins: FormGroup;
    val: boolean = false;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private fb: FormBuilder,
        private actions$: Actions
    ) {
        this.centro = {
            centroId: 0,
            empId: 1,
            cenDes: '',
            cenDir: '',
            cenPlace: '',
            cenCap: 0,
            created_at: '',
            updated_at: '',
            cenContacto: '',
            centEmail: '',
            cenHoraApertura: '',
            cenHoraCierre: '',
            cenStockLimitWeb: '',
            cenStockLimiteRepo: '',
            cenEstado: 'A',
            cenTelefono: '',
            cenLat: '',
            cenLong: '',
            cenDiasLaborales: []
        };

        // Obtener la hora actual
        const now = new Date();
        const horaApertura = new Date();
        const horaCierre = new Date();
        
        // Establecer hora de apertura por defecto (8:00 AM)
        horaApertura.setHours(8, 0, 0);
        
        // Establecer hora de cierre por defecto (18:00 PM)
        horaCierre.setHours(18, 0, 0);

        // Días laborales por defecto (Lunes a Sábado)
        const diasLaboralesDefault = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

        this.ins = this.fb.group({
            cenDes: ['', [Validators.required]],
            cenCap: [100, [Validators.required, Validators.min(0)]],
            cenEstado: ['A', [Validators.required]],
            cenContacto: ['', [Validators.required]],
            cenTelefono: ['', [Validators.required, Validators.pattern('^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$')]],
            centEmail: ['', [Validators.required, Validators.email]],
            cenHoraApertura: [horaApertura, [Validators.required]],
            cenHoraCierre: [horaCierre, [Validators.required]],
            cenStockLimitWeb: [1000, [Validators.required, Validators.min(0)]],
            cenStockLimiteRepo: [500, [Validators.required, Validators.min(0)]],
            diasLaborales: [diasLaboralesDefault, [Validators.required, Validators.minLength(1)]]
        });
    }

    ngOnInit() {
        this.loadGoogleMaps();
    }

    private loadGoogleMaps() {
        // Verificar si el script ya está cargado
        if (typeof google !== 'undefined' && google.maps) {
            this.initMap();
            this.initAutocomplete();
            return;
        }

        const script = document.createElement('script');
        script.src = this.environment.keygoogle;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            this.initMap();
            this.initAutocomplete();
        };
        document.body.appendChild(script);
    }

    private initMap() {
        if (!this.mapElement?.nativeElement) {
            setTimeout(() => this.initMap(), 100);
            return;
        }

        const defaultLocation = { lat: -33.4489, lng: -70.6693 }; // Santiago, Chile
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            mapId: "8f12f5c66213fef5", // ID de mapa para marcadores avanzados
            center: defaultLocation,
            zoom: 12,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });
    }

    private initAutocomplete() {
        if (!this.cenDirInput?.nativeElement) {
            setTimeout(() => this.initAutocomplete(), 100);
            return;
        }

        this.autocomplete = new google.maps.places.Autocomplete(this.cenDirInput.nativeElement, {
            fields: ['address_components', 'geometry', 'name'],
            types: ['address'],
            componentRestrictions: { country: 'CL' }
        });

        this.autocomplete.addListener('place_changed', () => {
            const place = this.autocomplete?.getPlace();
            if (place && place.geometry) {
                this.centro.cenDir = this.cenDirInput.nativeElement.value;
                this.centro.cenPlace = place.name || '';
                this.centro.cenLat = place.geometry.location?.lat().toString() || '';
                this.centro.cenLong = place.geometry.location?.lng().toString() || '';

                if (this.map && place.geometry.location) {
                    const position = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    };

                    if (this.marker) {
                        if ('setMap' in this.marker) {
                            this.marker.setMap(null);
                        } else {
                            this.marker.map = null;
                        }
                    }

                    // Intentar usar AdvancedMarkerElement si está disponible
                    if (google.maps.marker && 'AdvancedMarkerElement' in google.maps.marker) {
                        const markerView = new google.maps.marker.PinElement({
                            background: '#4285F4',
                            borderColor: '#FBBC04',
                            glyphColor: '#FFFFFF'
                        });

                        this.marker = new google.maps.marker.AdvancedMarkerElement({
                            map: this.map,
                            position: position,
                            title: this.centro.cenDes,
                            content: markerView.element
                        });
                    } else {
                        // Fallback al marcador tradicional si AdvancedMarkerElement no está disponible
                        this.marker = new google.maps.Marker({
                            position: position,
                            map: this.map,
                            title: this.centro.cenDes
                        });
                    }

                    this.map.setCenter(position);
                    this.map.setZoom(15);
                }
            }
        });
    }

    onSave() {
        if (this.ins.valid) {
            this.val = true;
         
           const fechaFormateadaApertura = this.ins.value.cenHoraApertura.toISOString();
           const fechaFormateadaCierre = this.ins.value.cenHoraCierre.toISOString();
            this.centro.cenDiasLaborales = this.ins.value.diasLaborales;
            this.centro.cenHoraApertura = fechaFormateadaApertura;
            this.centro.cenHoraCierre = fechaFormateadaCierre;
            this.centro.cenStockLimitWeb = this.ins.value.cenStockLimitWeb;
            this.centro.cenStockLimiteRepo = this.ins.value.cenStockLimiteRepo;
            this.centro.cenContacto = this.ins.value.cenContacto;
            this.centro.centEmail = this.ins.value.centEmail;
            this.centro.cenTelefono = this.ins.value.cenTelefono;
            this.centro.cenEstado = this.ins.value.cenEstado;
            this.centro.cenDes = this.ins.value.cenDes;
            this.centro.cenCap = this.ins.value.cenCap;            
            this.store.dispatch(incrementarRequest({request: 1}));
            this.store.dispatch(createCentroRequest({ centro: this.centro }));
            this.actions$.pipe(
                ofType(createCentroSuccess),
                take(1)
            ).subscribe(() => {
               setTimeout(() => {
                this.router.navigate(['/desk/parametros/centro']);
               }, 1000);
            });
        }
    }

    onCancel() {
        this.router.navigate(['/desk/seguridad/centro']);
    }
}
