import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Environment {
    public cluster     = 'mt1';
    public key         = 'ASDbO1OD8RIa8C37Ox';
    public wsHost      = 'app.back.agileti.cl';
    public wsPort      = '6001';
    public forceTLS    = 'false';
    public disableStats= 'false';
    public keygoogle   = "";
    public keygoogleMap= 'AIzaSyADuggTVu7JnRb0L_fIENMWltBUgHBCSkI';
} 
