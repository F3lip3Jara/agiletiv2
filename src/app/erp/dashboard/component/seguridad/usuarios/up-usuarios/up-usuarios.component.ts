import { DatePipe, registerLocaleData } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, defaultIfEmpty, distinctUntilChanged, take } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Roles } from '../../state/interface/roles.interface';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import {  selectRoles, selectRolesById } from '../../state/selectors/roles.selectors';
import { CreateUsuario, UpdateUsuario, Usuario } from '../../state/interface/usuarios.interface';
import { dataUsuarioRequest, updateUsuarioRequest, updateUsuarioSuccess, usuariosError } from '../../state/actions/usuarios.actions';
import localeEs from '@angular/common/locales/es';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { getRolesRequest } from '../../state/actions/roles.actions';
import { selectUsuarioAvatar } from '../../state/selectors/usuarios.selectors';
import { incrementarRequest } from '../../../state/actions/estado.actions';
import { ofType } from '@ngrx/effects';
import { Actions } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
registerLocaleData(localeEs);


@Component({
  selector: 'app-up-usuarios',
  templateUrl: './up-usuarios.component.html',
  styleUrl: './up-usuarios.component.scss'
})
export class UpUsuariosComponent {
  usuario :any               = {};
  up               : FormGroup;
  token            : string  = '';
  roles            : any     = {};
  parms            : any     = [];
  val              : boolean = false;
  loading          : boolean = false;
  gerencia         : any     = {};
  validNombre      : boolean = false;
  dato             : number  = 0;
  empresa          : any     = {};
  model?: Date ;
  imageChangedEvent: any     = '';
  croppedImage     : any     =  '';
  avatar           : any     =  ''; 
  password         : boolean = false;
  showPassword     : boolean = false;
  dia              : number  = 0;
  mes              : number  = 0;
  ano              : number  = 0;
  fecha?           : Date;
  dateModel?: { year: number, month: number, day: number };
  roles$ :   Observable<Roles[]>;  
  @ViewChild('inputAvatar' , {static: false}) inputAvatar: ElementRef;
  @ViewChild('inputPassword' , {static: false}) inputPassword: any;
  @ViewChild('inputPassword2' , {static: false}) inputPassword2: any;
  display: boolean = false;
  label: string    = '';
  private subscription: Subscription = new Subscription();
  activeIndex: number | undefined = 0;
  checked: boolean = false;
  selectedRole$: Observable<Roles>;

  
  constructor(fgUser             : FormBuilder,
            private router       : Router,
            private route        : ActivatedRoute,
            private actions$: Actions,
            private messageService: MessageService,
            private store: Store<AppState>,
) {

      this.up = fgUser.group({
            nombre : ['' , Validators.compose([
            Validators.required,
            ])],
            apellido : ['' , Validators.compose([
            Validators.required
            ])],
            fechaNacimiento : ['' , Validators.compose([
            ])],
            rol : ['' , Validators.compose([
              Validators.required
            ])],
            password : ['' , Validators.compose([
              
            ])],
            password2 : ['' , Validators.compose([
             
            ])],
      });
    
}
 
  ngOnInit(){
   
    this.route.params.subscribe(params => {
      const dato   = params['usuario'];
      this.usuario = JSON.parse(atob(dato));
      let name     = this.usuario.name;
      let id       = this.usuario.id;
      this.store.dispatch(incrementarRequest({request: 2}));
    
      this.loading = true;
      this.store.dispatch(getRolesRequest())
      // llama a la acción para obtener los todos
      this.roles$ = this.store.select(selectRoles).pipe(
        filter(roles => roles !== null && roles !== undefined), // Filtra valores nulos o indefinidos
        defaultIfEmpty([]) // Proporciona un array vacío si no hay roles
      );

      this.subscription.add(
        this.roles$.subscribe(roles => {
          this.loading = false;
          if (roles.length > 0 ) {        
          this.selectedRole$ = this.store.select(selectRolesById, { id:this.usuario.rolId });
          this.selectedRole$.subscribe(usuario => {
            this.up.controls['rol'].setValue(usuario.rolId);
          });            
          }
        })
       );

       
       let usuariox : any = {
        id: this.usuario.id,
        gerId:0,
        emploAvatar: ''
      }     
        // Despacha la acción para obtener los datos del usuario
        this.store.dispatch(dataUsuarioRequest({ usuario: usuariox }));
        this.subscription.add(
          this.store.select(selectUsuarioAvatar, {id: id}).pipe(
            filter(user => !!user), // Filtra para asegurarte de que hay un usuario
            take(1) // Se suscribe solo una vez
          ).subscribe((user) => {
          
            if(user.emploAvatar !== null){
              this.avatar = user.emploAvatar;         
            }else{
                  this.label = name.substring(0,2);
              }
          })
        );
    });
  
    const fechaNacimiento = new Date(this.usuario.emploFecNac);
    this.up.controls['fechaNacimiento'].setValue(fechaNacimiento.toISOString().split('T')[0]); // Formato YYYY-MM-DD
    this.up.controls['apellido'].setValue(this.usuario.emploApe);
    this.up.controls['nombre'].setValue(this.usuario.emploNom);
    
  this.up.controls['password'].valueChanges.pipe(
    debounceTime(200),
    distinctUntilChanged()).subscribe(field => {
        this.up.controls['password2'].setValue('');
        this.password = false;    
        this.updatePasswordValidationClasses();
        this.updatePassword2ValidationClasses();
    });

  this.up.controls['password2'].valueChanges.pipe(
    filter(text => text.length >= 1),
    debounceTime(200),
    distinctUntilChanged()).subscribe(field => {
        const xpassword = this.up.controls['password'].value;
        this.password = field !== xpassword;
      
        this.updatePassword2ValidationClasses();
    });

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

  public guardar(nombre : string, apellido : string, rol : number,  fechaNacimiento : Date, password : string, password2 : string){
    this.val          = true;
    let usuariox : UpdateUsuario = {

        'id'            : this.usuario.id,
        'rol'           : rol,
        'gerId'         : 0,
        'empName'       : nombre,
        'emploApe'      : apellido,
        'emploFecNac'   : fechaNacimiento,
        'emploAvatar'   : this.avatar,
        'empId'         : 0,
        'password'      : password,
        'mantenerPassword': this.checked ? 1 : 0,
    } 
    this.val = true;
    this.store.dispatch(incrementarRequest({request:1}));
    this.store.dispatch(updateUsuarioRequest({usuario:usuariox}));     

    this.actions$.pipe(
      ofType(updateUsuarioSuccess)
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
    this.label = this.up.controls['nombreUsuario'].value.substring(0,1);
   this.inputAvatar.nativeElement.value = '';
  }

  ngOnDestroy(): void {
        this.subscription.unsubscribe(); // Desuscribirse de todas las suscripciones
  }

  private updatePasswordValidationClasses(): void {
    const inputElement = this.inputPassword.input.nativeElement;
    if (this.up.controls['password'].value.length == 0 || this.password) {
        inputElement.classList.add('was-validated-password');
        inputElement.classList.remove('is-valid-password');
   
    } else {
        inputElement.classList.add('is-valid-password');
        inputElement.classList.remove('was-validated-password');
       
    }
  }

  private updatePassword2ValidationClasses(): void {
    const inputElement = this.inputPassword2.input.nativeElement;
    if (this.up.controls['password2'].value.length == 0 || this.password) {
        inputElement.classList.add('was-validated-password');
        inputElement.classList.remove('is-valid-password');       
    } else {
        inputElement.classList.add('is-valid-password');
        inputElement.classList.remove('was-validated-password');
    }
  }

  

  activeIndexChange(index : number){
      this.activeIndex = index
  }
}
