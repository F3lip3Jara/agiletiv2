export interface Ubicaciones {
    ubicacionId: number;
    empId: number;
    centroId: number;
    almId: number;
    sectorId: number;
    ubiDes: string;
    ubiCod: string;
    ubiAlto: number;
    ubiAncho: number;
    ubiLargo: number;
    ubiVol: number;
    ubiAct: number;
    // Agrega más propiedades según necesites
}

export const _KEYS = [
    'ubicacionId',
    'empId', 
    'centroId',
    'almId',
    'sectorId',
    'ubiDes',
    'ubiCod',
    'ubiAlto',
    'ubiAncho',
    'ubiLargo',
    'ubiVol',
    'ubiAct'
    // Agrega más keys según necesites
];
