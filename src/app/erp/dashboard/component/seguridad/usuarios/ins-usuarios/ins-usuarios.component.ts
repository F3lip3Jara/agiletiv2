import { Component, ElementRef,  OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, Observable, of } from 'rxjs';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, defaultIfEmpty, distinctUntilChanged, map } from 'rxjs/operators';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { getRolesRequest } from '../../state/actions/roles.actions';
import { selectRoles } from '../../state/selectors/roles.selectors';
import { Roles } from '../../state/interface/roles.interface';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { CreateUsuario, Usuario } from '../../state/interface/usuarios.interface';
import {  selectUsuarios } from '../../state/selectors/usuarios.selectors';
import { createUsuarioRequest, createUsuarioSuccess, getUsuariosRequest, usuariosError } from '../../state/actions/usuarios.actions';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { Actions } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
registerLocaleData(localeEs);


@Component({
  selector: 'app-ins-usuarios',
  templateUrl:'./ins-usuarios.component.html',
  styleUrl: './ins-usuarios.component.scss'
})
export class InsUsuariosComponent implements OnInit {
   
    roles$ :   Observable<Roles[]>;
    usuarios$: any[];
    filterRoles      : string [];
    imageChangedEvent: any    = '';
    croppedImage     : any    =  '';
    avatar           : any    =  '';
    ins              : FormGroup;
    validNombre      : boolean      = false;
    faArrowTurnDown = faArrowDown;
    val              : boolean      = false;
    usuarios: Observable<Usuario[]>;
    display: boolean = false; 
    label: string    = '';
    @ViewChild('inputAvatar' , {static: false}) inputAvatar: ElementRef;
    // Controla la visibilidad del popup

    constructor(private store: Store<AppState>,
                private router: Router,
                private fb: FormBuilder,
                private actions$: Actions,
                private messageService: MessageService
              ) {
               }

    ngOnInit() {
      this.ins = this.fb.group({
            nombre: ['', Validators.required],
            apellido: ['', Validators.required],
            fechaNacimiento: [''],
            rol: ['', Validators.required],
            nombreUsuario: ['', [Validators.required]]
      });
      
      this.store.dispatch(getRolesRequest());
      this.store.dispatch(incrementarRequest({request: 1}));
        // llama a la acción para obtener los todos
        this.roles$ = this.store.select(selectRoles).pipe(
          filter(roles => roles !== null && roles !== undefined), // Filtra valores nulos o indefinidos
          defaultIfEmpty([]) // Proporciona un array vacío si no hay roles
      );
    
      this.store.select(selectUsuarios).subscribe(usuarios => {        
        this.usuarios$ = usuarios.usuarios;
      });

   
      if( this.usuarios$.length === 0){
        this.store.dispatch(getUsuariosRequest());
        this.store.dispatch(incrementarRequest({request: 1}));
      }

      this.ins.controls['nombreUsuario'].valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(control => control !== null && control !== undefined),
        filter(control => control.length >= 1)
      ).subscribe(control => {
        this.validarNombre(control);
        this.label = control.substring(0,1);
      });


     
    }

    fileChangeEvent(event: any): void {  
      console.log(event);
       
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

    validarNombre(control: any) {
      // Lógica para validar el nombre de usuario
      this.validNombre = false; // Inicializa a falso
      const nombreUsuario = control;
      // Verifica si el nombre de usuario ya existe en el estado   
        const existe = this.usuarios$.some(usuario => usuario.name === nombreUsuario);
        if (existe || nombreUsuario.length < 5 || nombreUsuario.includes(' ')) {
          this.validNombre = true;
        }
        return this.validNombre; // Devuelve null si no hay errores
    }

  
    public guardar( nombre: string , apellido: string , fecha: Date , rol: number , nombreUsuario : string){
   
      let usuario : CreateUsuario = {

          'name'          : nombreUsuario,      
          'rol'           : rol,
          'gerId'         : 0,
          'empName'       : nombre,
          'emploApe'      : apellido,
          'emploFecNac'   : fecha,
          'emploAvatar'   : this.avatar,
          'empId'         : 0,
      }
      this.val = true;
      this.store.dispatch(incrementarRequest({request:1}));
      this.store.dispatch(createUsuarioRequest({usuario}));
      
      this.actions$.pipe(
        ofType(createUsuarioSuccess)
      ).subscribe(() => {
        setTimeout(() => {
          this.val = false;
          this.router.navigate(['/desk/seguridad/usuarios']);
        }, 1000);
      });

      this.actions$.pipe(
        ofType(usuariosError)
      ).subscribe((error) => {
        this.messageService.add({severity:'error', summary:'Error', detail:error.error});
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
      this.label = this.ins.controls['nombreUsuario'].value.substring(0,1);
      this.inputAvatar.nativeElement.value = '';
    }
}

