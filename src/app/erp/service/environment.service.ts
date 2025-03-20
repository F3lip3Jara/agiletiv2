import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Environment {
    public cluster     = 'mt1';
    public key         = '';
    public wsHost      = '';
    public wsPort      = '';
    public forceTLS    = 'false';
    public disableStats= 'false';
    public keygoogle   = "";
    public keygoogleMap= '';
} 
