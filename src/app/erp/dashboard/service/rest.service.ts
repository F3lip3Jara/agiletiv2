import { Injectable } from '@angular/core';
import {HttpClient, HttpParams , HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { UsersService } from '../../service/users.service';


@Injectable({
  providedIn: 'root'
})

export class RestService {

  constructor(private http          : HttpClient ,
              private UsersService  : UsersService  ) {
    
}

  public get(url:string , tok : string , parms : any){
    let token = this.UsersService.getToken();
    let headers : HttpHeaders  = new HttpHeaders ({"access-token" : token});
    let parmx   : HttpParams   = new HttpParams();
    parms.forEach(function (val : any) {
     parmx                     =  parmx.set(val.key, val.value);
    });    
    return this.http.get(url , { headers: headers , params: parmx , reportProgress:true});
  
  }

  public post(url:string , tokens: string , data : any) : Observable<any> {      
    let crf                   = this.UsersService.getTokenCrf(); 
    let token = this.UsersService.getToken();    
    let headers : HttpHeaders = new HttpHeaders ({"access-token" : token , "Content-Type":"application/json" ,  "X-CSRF-TOKEN": crf ,  'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0' });   
    return this.http.post(url, data, { headers : headers , reportProgress:true });
  }
 
}
