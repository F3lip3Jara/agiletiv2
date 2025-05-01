export interface Pedidonac {
    empId: number;
    id: number;
    usuario: string;
    orden_compra: string;
    orden_produccion: string;
    proveedor: string;
    prv_telefono: string;
    proveedor_id: number;
    rut: string;
    fecha: string;
    estado_ord: string;
    estado_pro: string;
    observaciones: string;
    prd_total: number;  
    tipo: string;
    tipo_cod: string;
    tipo_des: string;
    tipo_id: number;
    almacen_id: number;
    almacen_destino: string;
    centro_id: number;
    centro_destino: string;
    latitud: string;
    longitud: string;
    fech_promesa: string;
    created_at: string;
    updated_at: string;
    prd_total_lineas: number;
}

export interface PedidonacDet {
    empId: number;
    id: number;
    usuario: string;
    orden_compra: string;
    orden_produccion: string;
    proveedor: string;
    prv_telefono: string;
    proveedor_id: number;
    rut: string;
    fecha: string;
    estado_ord: string;
    estado_pro: string;
    observaciones: string;
    prd_total: number;  
    tipo: string;
    tipo_des: string;
    tipo_id: number;
    almacen_id: number;
    almacen_destino: string;
    centro_id: number;
    centro_destino: string;
    latitud: string;
    longitud: string;
    fech_promesa: string;
    created_at: string;
    updated_at: string;
    detalle: any[];
}

export const PEDIDONAC_KEYS = [
    'empId',
    'id',
    'usuario',
    'orden_compra',
    'orden_produccion',
    'proveedor',
    'prv_telefono',
    'proveedor_id',
    'rut',
    'fecha',
    'estado_ord',
    'estado_pro',
    'observaciones',
    'prd_total',  
    'tipo',
    'tipo_des',
    'tipo_id',
    'almacen_id',
    'almacen_destino',
    'centro_id',
    'centro_destino',
    'latitud',
    'longitud',
    'fech_promesa',
    'created_at',
    'updated_at',
    'prd_total_lineas'
   
];
