
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../app.state';
import { Empresa } from '../../../state/interface/empresa.interface';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { incrementarRequest } from '../../../../state/actions/estado.actions';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { createEmpresaRequest, createEmpresaSuccess, empresaError } from '../../../state/actions/empresa.actions';
import { ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { Actions } from '@ngrx/effects';
  
  
@Component({
  selector: 'app-ins-empresa',
  templateUrl: './ins-empresa.component.html',
  styleUrl: './ins-empresa.component.scss'
})
export class InsEmpresaComponent {
  

    empresa$: Observable<Empresa[]>;
    ins: FormGroup;
    faArrowTurnDown = faArrowDown;
    val: boolean = false;
    valRut: boolean = false;
    mensaje: string = '';
    imageChangedEvent: any = '';
    croppedImage: any = '';
    avatar: any = '';
    display: boolean = false;
    label: string = '';
    @ViewChild('inputAvatar', { static: false }) inputAvatar: ElementRef;
  
    constructor(
      private store: Store<AppState>,
      private router: Router,
      private fb: FormBuilder,
      private actions$: Actions,
      private messageService: MessageService
    ) {}
  
    ngOnInit() {
      this.ins = this.fb.group({
        empDes: ['', Validators.required],
        empDir: ['', Validators.required],
        empRut: ['', [Validators.required,
                     Validators.pattern('^[0-9]+-[0-9kK]{1}')]],
        empGiro: ['', Validators.required],
        empFono: ['', Validators.required],
        empTokenOMS: ['']
      });
  
      // Validación del RUT
      this.ins.controls['empRut'].valueChanges.pipe(
        filter(text => text.length > 7),
        debounceTime(200),
        distinctUntilChanged()
      ).subscribe(rut => {
        this.validarRut(rut);
      });

      this.ins.controls['empDes'].valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(control => control !== null && control !== undefined),
        filter(control => control.length >= 1)
      ).subscribe(control => {      
        this.label = control.substring(0,1);
      });
    }
  
    validarRut(rut: string) {
      const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
      this.valRut = rutRegex.test(rut);
      this.mensaje = this.valRut ? '' : 'Rut incorrecto';
    }
  
    fileChangeEvent(event: any): void {           
      this.imageChangedEvent = event;
      this.display = true; // Muestra el popup al seleccionar una imagen   
    }
  
    imageCropped(event: ImageCroppedEvent): void {
      this.croppedImage = event.blob;          
    }
    
    imageLoaded(): void {
      // Imagen cargada
    }
    
    cropperReady(): void {
      // El recortador está listo
    }
    
    loadImageFailed(): void {
      this.avatar = '';
      this.inputAvatar.nativeElement.value = '';
      this.croppedImage = '';
    }
    
    resizeImage(file: File): Promise<string | ArrayBuffer | null> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const img = new Image();
            img.src = e.target.result;
    
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              // Ajusta el tamaño deseado, por ejemplo, 800x600
              canvas.width  = 150;
              canvas.height = 150;
              // Dibuja la imagen en el lienzo
              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
              // Convierte el lienzo a base64
              const resizedImage = canvas.toDataURL('image/jpeg');
              resolve(resizedImage);
            };
    
            img.onerror = (error) => {
              reject(error);
            };
          };
    
          reader.readAsDataURL(file);
        });
      
    }

    acceptCrop(): void {
      // Aquí puedes manejar la imagen recortada, por ejemplo, guardarla en el avatar
      this.resizeImage(this.croppedImage).then(resizedImage => {
        this.avatar = resizedImage;
       });
      
      this.display = false; // Cierra el popup
    }
  
    cancelCrop(): void {
      this.display = false; // Cierra el popup sin guardar cambios
    }

    clearAvatar(){
      this.avatar = '';
      this.label = this.ins.controls['empDes'].value.substring(0,1);
     this.inputAvatar.nativeElement.value = '';
    }

    public guardar(empDes: string, empDir: string, empRut: string, empGiro: string, empFono: string, empTokenOMS: string) {
      if (this.ins.valid && this.valRut) {
       let empresa: Empresa = { 
        empId: 0,
        empDes: empDes,
        empDir: empDir,
        empRut: empRut,
        empGiro: empGiro,
        empFono: empFono,
        empTokenOMS: empTokenOMS
      }
        this.val = true;   
        this.store.dispatch(incrementarRequest({ request: 1 }));
        this.store.dispatch(createEmpresaRequest({empresa: empresa }));
       
        this.actions$.pipe(
            ofType(createEmpresaSuccess)
        ).subscribe(() => {    
            setTimeout(() => {
                this.val = false;
                this.router.navigate(['/desk/seguridad/administracion/empresa']);
            }, 1000);
        });

        // Suscribirse a la acción de error
        this.actions$.pipe(
            ofType(empresaError)
        ).subscribe((error) => {
            this.val = false;
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al guardar la  empresa'
            });
        });
        }
    }


   
  } 