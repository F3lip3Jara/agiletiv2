export interface Stock {
    stockId: number;
    centroId: number;
    almId: number;
    prdId: number;
    stockQty: number;
    stockEst: number;
    created_at: string;
    updated_at: string;
    cenDes: string;
    almDes: string;
    cod_pareo: string;
    descripcion: string;
    grupo: string;
    sub_grupo: string;
    color: string;
    moneda: string;
    costo: number;
    neto: number;
    bruto: number;
    medida: string;
    minimo: number;
    url: string;
    talla: string;  
}

export const STOCK_KEYS = [
    'stockId',
    'centroId',
    'almId',
    'prdId',
    'stockQty',
    'stockEst',
    'created_at',
    'updated_at',
    'cenDes',
    'almDes',
    'cod_pareo',
    'descripcion',
    'grupo',
    'sub_grupo',
    'color',
    'moneda',
    'costo',
    'neto',
    'bruto',
    'medida',
    'minimo',
    'url',
    'talla',
];
