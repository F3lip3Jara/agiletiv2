
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RestService } from 'src/app/erp/dashboard/service/rest.service';
import { UsersService } from 'src/app/erp/service/users.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';


@Injectable({
  providedIn: 'root'
})
export class RegionServices {  
  token      : string     = '';
  parametros : any        = [];

  constructor(
              private rest    : RestService,
              private userSer : UsersService,
              private store   : Store<AppState>
  ) {  }

   getRegion(): Observable<any> {
    this.token = this.userSer.getToken();
    
       return this.rest.get('trabRegion', this.token, this.parametros).pipe(
        map(
          (data: any) => data
          
      ) 
    );
  }

  uploadRegion(pais: any): Observable<any> {
   
    return this.rest.post('cargaMasivaReg', this.token, pais).pipe(
      map((data: any) => data)
    );
  }

  getRegionesPais(pais: any): Observable<any> {
    this.parametros = [{key: 'paiId', value: pais.paiId}];  
    return this.rest.get('regPai', this.token, this.parametros).pipe(
      map((data: any) => data  )
    );
  }

  checkUploadStatus(jobId: number): Observable<any> {
    this.parametros = [{key: 'regCargaId', value: jobId}];  
    return this.rest.get('estadoCarga', this.token, this.parametros).pipe(
      map((data: any) => data)
    );
  }

}
