import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Centro } from '../../component/parametros/centro/interface/centro.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CentroService {
    private apiUrl = `${environment.apiUrl}/centros`;

    constructor(private http: HttpClient) { }

    getCentros(): Observable<Centro[]> {
        return this.http.get<Centro[]>(this.apiUrl);
    }

    getCentroById(id: number): Observable<Centro> {
        return this.http.get<Centro>(`${this.apiUrl}/${id}`);
    }

    createCentro(centro: Centro): Observable<Centro> {
        return this.http.post<Centro>(this.apiUrl, centro);
    }

    updateCentro(centro: Centro): Observable<Centro> {
        return this.http.put<Centro>(`${this.apiUrl}/${centro.centroId}`, centro);
    }

    deleteCentro(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 