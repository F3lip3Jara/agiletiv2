
export interface Producto {
    id: number;
    cod_pareo: string;
    descripcion: string;
    descripcion_corta: string;
    observaciones: string;
    cod_rapido: string;
    cod_barra: string;
    tipo: string;
    grupo: any ;
    sub_grupo: any;
    color: any;
    moneda: string;
    costo: number;
    neto: number;
    bruto: number;
    medida: any;
    peso: string;
    minimo: string;
    inventariable: string;
    id_ext: string;
    url: string;
    talla: any;
    alto: number;
    ancho: number;
    largo: number;
    volumen: number;
    created_at: string;
    updated_at: string;
    codcolor: string;
    codgrupo: string;
    codsubgrupo: string;
    codmedida: string;
    codtalla: string;
}

export const PRODUCTOS_KEYS = {
    id: 'id',
    cod_pareo: 'cod_pareo',
    descripcion: 'descripcion',
    descripcion_corta: 'descripcion_corta',
    observaciones: 'observaciones',
    cod_rapido: 'cod_rapido',
    cod_barra: 'cod_barra',
    tipo: 'tipo',
    grupo: 'grupo',
    sub_grupo: 'sub_grupo',
    color: 'color',
    moneda: 'moneda',
    costo: 'costo',
    neto: 'neto',
    bruto: 'bruto',
    medida: 'medida',
    peso: 'peso',
    minimo: 'minimo',
    inventariable: 'inventariable',
    id_ext: 'id_ext',
    url: 'url',
    talla: 'talla',
    alto: 'alto',
    ancho: 'ancho',
    largo: 'largo',
    volumen: 'volumen',
    created_at: 'created_at',
    updated_at: 'updated_at',
    codcolor: 'codcolor',
    codgrupo: 'codgrupo',
    codsubgrupo: 'codsubgrupo',
    codmedida: 'codmedida',
    codtalla: 'codtalla',
    
};
  

