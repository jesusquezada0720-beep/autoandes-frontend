import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente, IngresoServicio, Orden, OrdenRequest, Servicio, ServicioRequest, Vehiculo, VehiculoRequest } from '../models/api.models';

const api = environment.apiUrl;
@Injectable({ providedIn: 'root' })
export class ClienteApi { constructor(private http: HttpClient) {} listar(): Observable<Cliente[]> { return this.http.get<Cliente[]>(`${api}/clientes`); } }
@Injectable({ providedIn: 'root' })
export class ServicioApi {
  constructor(private http: HttpClient) {}
  listar(): Observable<Servicio[]> { return this.http.get<Servicio[]>(`${api}/servicios`); }
  obtener(id: number): Observable<Servicio> { return this.http.get<Servicio>(`${api}/servicios/${id}`); }
  crear(data: ServicioRequest): Observable<Servicio> { return this.http.post<Servicio>(`${api}/servicios`, data); }
  actualizar(id: number, data: ServicioRequest): Observable<Servicio> { return this.http.put<Servicio>(`${api}/servicios/${id}`, data); }
  eliminar(id: number): Observable<void> { return this.http.delete<void>(`${api}/servicios/${id}`); }
  estado(id: number, activo: boolean): Observable<Servicio> { return this.http.patch<Servicio>(`${api}/servicios/${id}/estado`, { activo }); }
}
@Injectable({ providedIn: 'root' })
export class VehiculoApi {
  constructor(private http: HttpClient) {}
  listar(clienteId?: number): Observable<Vehiculo[]> {
    const params = clienteId ? new HttpParams().set('clienteId', clienteId) : undefined;
    return this.http.get<Vehiculo[]>(`${api}/vehiculos`, { params });
  }
  obtener(id: number): Observable<Vehiculo> { return this.http.get<Vehiculo>(`${api}/vehiculos/${id}`); }
  crear(data: VehiculoRequest): Observable<Vehiculo> { return this.http.post<Vehiculo>(`${api}/vehiculos`, data); }
  actualizar(id: number, data: VehiculoRequest): Observable<Vehiculo> { return this.http.put<Vehiculo>(`${api}/vehiculos/${id}`, data); }
  eliminar(id: number): Observable<void> { return this.http.delete<void>(`${api}/vehiculos/${id}`); }
}
@Injectable({ providedIn: 'root' })
export class OrdenApi {
  constructor(private http: HttpClient) {}
  listar(filtros: { placa?: string; estado?: string; desde?: string; hasta?: string }): Observable<Orden[]> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([key, value]) => { if (value) params = params.set(key, value); });
    return this.http.get<Orden[]>(`${api}/ordenes`, { params });
  }
  obtener(id: number): Observable<Orden> { return this.http.get<Orden>(`${api}/ordenes/${id}`); }
  crear(data: OrdenRequest): Observable<Orden> { return this.http.post<Orden>(`${api}/ordenes`, data); }
  anular(id: number, motivo: string): Observable<Orden> { return this.http.patch<Orden>(`${api}/ordenes/${id}/anular`, { motivo }); }
}
@Injectable({ providedIn: 'root' })
export class ReporteApi {
  constructor(private http: HttpClient) {}
  ingresos(desde: string, hasta: string): Observable<IngresoServicio[]> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<IngresoServicio[]>(`${api}/reportes/ingresos-por-servicio`, { params });
  }
}
