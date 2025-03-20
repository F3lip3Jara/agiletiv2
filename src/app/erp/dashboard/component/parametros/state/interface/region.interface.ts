export interface Region {
    regId: number,
    regDes: string,
    regCod: string,
    empId: number,
    paiId: number,
    created_at: string,
    updated_at: string,
    paiDes: string,
    paiCod: string
}

export const REGION_KEYS = [
    'regId',    
    'regDes',
    'regCod',
    'empId',
    'paiId',
    'created_at',
    'updated_at',
    'paiDes',
    'paiCod'
];
