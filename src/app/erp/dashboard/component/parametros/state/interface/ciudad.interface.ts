export interface Ciudad {
    empId: number;
    paiId: number;
    regId: number;
    created_at: string;
    updated_at: string;
    paiCod: string;
    paiDes: string;
    regCod: string;
    regDes: string;
    ciuId: number;
    ciuDes: string;
    ciuCod: string;
}

export const CIUDAD_KEYS = [
    'empId',
    'paiId',
    'regId',
    'created_at',
    'updated_at',
    'paiCod',
    'paiDes',
    'regCod',
    'regDes',
    'ciuId',
    'ciuDes',
    'ciuCod'
];
