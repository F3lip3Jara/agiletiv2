import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { Router, ActivatedRoute } from '@angular/router';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { Actions, ofType } from '@ngrx/effects';
import { Environment } from 'src/app/erp/service/environment.service';
import { Centro } from '../../state/interface/centro.interface';
import { updateCentroRequest, updateCentroSuccess } from '../../state/actions/centro.actions';
import { formatCurrency, formatDate } from '@angular/common';


declare global {
    interface Window {
        google: typeof google;
    }
}

@Component({
  selector: 'app-up-centro',
  templateUrl: './up-centro.component.html',
  styleUrl: './up-centro.component.scss'
})
export class UpCentroComponent implements OnInit {
    @ViewChild('map') mapElement!: ElementRef;
    @ViewChild('cenDir') cenDirInput!: ElementRef;
    private environment = new Environment();
   
    centro: Centro;
    map: google.maps.Map | null = null;
    marker: any = null;
    autocomplete: google.maps.places.Autocomplete | null = null;
    estados = [
        { label: 'Activo', value: 'activo' },
        { label: 'Inactivo', value: 'incativo' }
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
    
    upd: FormGroup;
    val: boolean = false;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private actions$: Actions,
        
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
            cenEstado: 'activo',
            cenTelefono: '',
            cenLat: '',
            cenLong: '',
            cenDiasLaborales: []
        };

        this.upd = this.fb.group({
            cenDes: ['', [Validators.required]],
            cenCap: [100, [Validators.required, Validators.min(0)]],
            cenEstado: ['A', [Validators.required]],
            cenContacto: ['', [Validators.required]],
            cenTelefono: ['', [Validators.required, Validators.pattern('^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$')]],
            centEmail: ['', [Validators.required, Validators.email]],
            cenHoraApertura: [new Date(), [Validators.required]],
            cenHoraCierre: [new Date(), [Validators.required]],
            cenStockLimitWeb: [1000, [Validators.required, Validators.min(0)]],
            cenStockLimiteRepo: [500, [Validators.required, Validators.min(0)]],
            diasLaborales: [[], [Validators.required, Validators.minLength(1)]]
        });
    }

    ngOnInit() {
        // Obtener el centro encriptado de los parámetros de la URL
        this.route.params.subscribe(params => {
            if (params['centro']) {
                const centroEncriptado = params['centro'];
                this.centro = JSON.parse(atob(centroEncriptado));
                this.loadCentroData();
            }
        });

        this.loadGoogleMaps();
    }

    private loadCentroData() {
        // Obtener la hora actual
        const now = new Date();
        const horaApertura = new Date();
        const horaCierre = new Date();
        
        // Establecer hora de apertura por defecto (8:00 AM)
        const [horas, minutos, segundos] = this.centro.cenHoraApertura.split(':').map(Number);
        horaApertura.setHours(horas, minutos, segundos);
    
    // 
        
        // Establecer hora de cierre por defecto (18:00 PM)
        const [horas2, minutos2, segundos2] = this.centro.cenHoraCierre.split(':').map(Number);
        horaCierre.setHours(horas2, minutos2, segundos2);

        console.log(this.centro.cenHoraApertura);
        console.log(this.centro.cenHoraCierre);
       
        const diasLaborales = this.centro.cenPlace ? JSON.parse(this.centro.cenPlace) : [];
        

        this.upd.patchValue({
            cenDes: this.centro.cenDes,
            cenCap: this.centro.cenCap,
            cenEstado: this.centro.cenEstado,
            cenContacto: this.centro.cenContacto,
            cenTelefono: this.centro.cenTelefono,
            centEmail: this.centro.centEmail,
            cenHoraApertura: horaApertura,
            cenHoraCierre: horaCierre,
            cenStockLimitWeb: this.centro.cenStockLimitWeb,
            cenStockLimiteRepo: this.centro.cenStockLimiteRepo,
            diasLaborales: diasLaborales
        });
    
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

        const position = {
            lat: parseFloat(this.centro.cenLat) || -33.4489,
            lng: parseFloat(this.centro.cenLong) || -70.6693
        };

        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            mapId: "8f12f5c66213fef5",
            center: position,
            zoom: 15,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        });

        // Crear el marcador inicial
        if (this.centro.cenLat && this.centro.cenLong) {
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
                this.marker = new google.maps.Marker({
                    position: position,
                    map: this.map,
                    title: this.centro.cenDes
                });
            }
        }
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

    onUpdate() {
        if (this.upd.valid) {
          //  this.val = true;
            const fechaFormateadaApertura = this.convertirDateToHora(this.upd.value.cenHoraApertura);
            const fechaFormateadaCierre = this.convertirDateToHora(this.upd.value.cenHoraCierre);
      
            const centroActualizado: Centro = {
                ...this.centro,
                cenDiasLaborales: this.upd.value.diasLaborales,
                cenHoraApertura: fechaFormateadaApertura,
                cenHoraCierre: fechaFormateadaCierre,
                cenStockLimitWeb: this.upd.value.cenStockLimitWeb,
                cenStockLimiteRepo: this.upd.value.cenStockLimiteRepo,
                cenContacto: this.upd.value.cenContacto,
                centEmail: this.upd.value.centEmail,
                cenTelefono: this.upd.value.cenTelefono,
                cenEstado: this.upd.value.cenEstado,
                cenDes: this.upd.value.cenDes,
                cenCap: this.upd.value.cenCap
            };
            this.store.dispatch(incrementarRequest({request: 1}));           
            this.store.dispatch(updateCentroRequest({ centro: centroActualizado }));
            this.actions$.pipe(
                ofType(updateCentroSuccess),
                take(1)
            ).subscribe(() => {
                setTimeout(() => {
                    this.router.navigate(['/desk/parametros/centro']);
                }, 1000);
            });
        }
    }

    onCancel() {
        this.router.navigate(['/desk/parametros/centro']);
    }


     convertirDateToHora(date: Date): string {
      // Obtener horas, minutos y segundos
      let horas = date.getHours().toString().padStart(2, '0');
      let minutos = date.getMinutes().toString().padStart(2, '0');
      let segundos = date.getSeconds().toString().padStart(2, '0');
  
      return `${horas}:${minutos}:${segundos}`;
  }
}
