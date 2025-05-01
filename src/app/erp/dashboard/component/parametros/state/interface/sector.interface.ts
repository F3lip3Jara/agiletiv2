export interface Sector {
    sectorId: number;
    empId: number;
    centroId: number;
    almId: number;
    secDes: string;
    secCod: string;
    updated_at: string;
    created_at: string;
}

export const SECTOR_KEYS = [
    'sectorId',
    'empId',
    'centroId',
    'almId',
    'secDes',
    'secCod',
    'updated_at',
    'created_at'
];
