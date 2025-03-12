import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {throwError,catchError, tap} from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { decrementarRequest, setAltura } from '../dashboard/component/state/actions/estado.actions';
export interface MensajesSystem{
    url    :string ,
    mensaje:string,
    type   :string
} 

@Injectable({
  providedIn: 'root'
})
export class InterceptorsErrorService implements HttpInterceptor  {


//private servidor: string = 'https://app.back.agileti.cl/';
//private servidor: string = 'http://127.0.0.1:8000/';
private servidor: string = 'https://app.back.qa.agileti.cl/';
private excludedUrl  : any [] = [


]; 

constructor(   private router : Router, private store: Store) {
   
 }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
   let count = 0;   
   this.excludedUrl.forEach((element : any) => { 
    if (req.url === element.url) {
       count ++;
    }
   });

   if(count > 0 ){  
      return next.handle(req);  
   }else{

    const cloneReq = req.clone({ url: this.servidor + req.url });
    return next.handle(cloneReq).pipe(
      tap(event => {
        this.handleHttpEvent(event);
        let altura = document.getElementsByTagName('body')[0].offsetHeight + 100;
        this.store.dispatch(setAltura({ altura: altura }));
      }),
      catchError(error => this.handleError(error))
    );

    

   }
  

   
  }
  
  private handleHttpEvent(event: HttpEvent<any>): void {
    if (event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.Response) {
    }
    if (event instanceof HttpResponse) {
      this.handleHttpResponse(event);
    }
  }
  
  private handleHttpResponse(response: HttpResponse<any>): void {
    this.store.dispatch(decrementarRequest());
    
    switch (response.status) {
      case 200:      
        break;
      case 203:
        this.router.navigate(['auth/access']);
        break;
      case 204:
       console.log('Registro posiblemente no encontrado');
        break;
    }
  }
  
  private handleSuccessResponse(body: any): void {
    try {
      if (Array.isArray(body)) {
        body.forEach(element => {
          if (element.mensaje.length > 0) {      
            
          }
        });
      }
    } catch (e) {
      // Manejar cualquier error durante el procesamiento del cuerpo de la respuesta
    }
  }
  
  private handleError(error: any): Observable<never> {
    let errorMessage = '';
  
    if (error instanceof ErrorEvent) {
      errorMessage = `Error en el cliente (interceptor): ${error.error.message}`;
    } else {
      switch (error.status) {
        case 406:
          this.router.navigate(['auth/error']);
          //this.servicio.setAlert('No se encuentra información', 'danger');
          break;
        case 403:
          this.router.navigate(['auth/access']);
          break;
        case 404:
          this.router.navigate(['auth/notfound']);
          break;
        default:
          errorMessage = `Error en el servidor (interceptor): ${error.message || 'Error desconocido'}`;
      }
    }
  
    return throwError(errorMessage);
  }
  
}
