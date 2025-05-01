export interface Almacen {
    empId: number;
    centroId: number;
    almId: number;
    almDes: string;
    almTip: string;
    almCap: number;
}

export const ALMACEN_KEYS = [
    'empId',
    'centroId',
    'almId',
    'almDes',
    'almTip',
    'almCap',
];
