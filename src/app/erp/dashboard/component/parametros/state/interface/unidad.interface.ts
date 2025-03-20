export interface Unidad {
    unId: number;
    empId: number;
    unCod: string;
    unDes: string;
    created_at: string;
    updated_at: string;

    // Agrega más propiedades según necesites
}

export const UNIDAD_KEYS = [
    'unId',
    'empId',
    'unCod',
    'unDes',
    'created_at',
    'updated_at'
];
