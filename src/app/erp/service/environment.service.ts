import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Environment {
    public cluster = '';
    public key = '';
    public wsHost = '';
    public wsPort = '';
    public forceTLS = '';
    public disableStats = '';
    public keygoogle = '';
    public keygoogleMap = '';
    public openWeatherApiKey = '';
}

export function setKeyGoogle(key: string) {
    this.Environment.keygoogle =
        'https://maps.googleapis.com/maps/api/js?key=' +
        key +
        '&v=beta&libraries=places,marker&solution_channel=GMP_QB_addressselection_v2_cABC';
}

export function setOpenWeatherApiKey(key: string) {
    this.Environment.openWeatherApiKey = key;
}

export function setkeygoogleMap(key: string) {
    this.Environment.keygoogleMap = key;
}
