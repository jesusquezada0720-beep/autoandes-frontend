export type Permiso =
  | 'SERVICIO_LEER' | 'SERVICIO_ESCRIBIR' | 'VEHICULO_LEER' | 'VEHICULO_ESCRIBIR'
  | 'ORDEN_LEER' | 'ORDEN_REGISTRAR' | 'ORDEN_ANULAR' | 'REPORTE_VER';

export interface UsuarioSesion {
  username: string;
  nombreCompleto: string;
  roles: string[];
  permisos: Permiso[];
}

export interface LoginResponse {
  tipo: 'Bearer';
  token: string;
  expiraEnSegundos: number;
  nombreCompleto: string;
  roles: string[];
  permisos: Permiso[];
}

export interface ErrorApi {
  timestamp?: string;
  status?: number;
  error?: string;
  mensaje?: string;
  ruta?: string;
  campos?: Record<string, string>;
}

export interface Cliente { id: number; documento: string; nombres: string; telefono?: string; }
export interface Servicio {
  id: number; codigo: string; nombre: string; precio: number; duracionMin: number; activo: boolean;
}
export interface ServicioRequest { codigo: string; nombre: string; precio: number; duracionMin: number; }
export interface Vehiculo {
  id: number; placa: string; marca: string; modelo: string; anio: number; clienteId: number; clienteNombre: string;
}
export interface VehiculoRequest { placa: string; marca: string; modelo: string; anio: number; clienteId: number; }
export interface DetalleOrdenRequest { servicioId: number; cantidad: number; }
export interface OrdenRequest { vehiculoId: number; kilometraje: number; detalles: DetalleOrdenRequest[]; }
export interface DetalleOrden {
  codigoServicio: string; nombreServicio: string; cantidad: number; precioUnitario: number; subtotal: number;
}
export interface Orden {
  id: number; numero: string; fecha: string; placa: string; estado: 'REGISTRADA' | 'ANULADA';
  kilometraje: number; total: number; usuarioRegistro: string; motivoAnulacion?: string; detalles: DetalleOrden[];
}
export interface IngresoServicio { codigo: string; nombre: string; cantidadTotal: number; montoTotal: number; }
