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
    public keygoogle   = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB265kXv00WBlRn2TXYgbndEnImq0Hg8Vk&v=beta&libraries=places,marker&solution_channel=GMP_QB_addressselection_v2_cABC";
    public keygoogleMap= 'AIzaSyB265kXv00WBlRn2TXYgbndEnImq0Hg8Vk';
} 