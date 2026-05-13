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

    constructor() {
        try {
            let userStr = localStorage.getItem('user');
            if (userStr) {
                let user = JSON.parse(atob(userStr));
                if (user.keygoogleMap) {
                    this.keygoogleMap = user.keygoogleMap;
                    this.keygoogle = 'https://maps.googleapis.com/maps/api/js?key=' + user.keygoogleMap + '&v=beta&libraries=places,marker&solution_channel=GMP_QB_addressselection_v2_cABC';
                }
                if (user.openWeatherApiKey) {
                    this.openWeatherApiKey = user.openWeatherApiKey;
                }
            }
        } catch (e) {
            console.error('Error parsing user from localStorage for Environment', e);
        }
    }
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
