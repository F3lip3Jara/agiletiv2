export interface Modulo {
    molId: number;
    empId: number;
    molDes: string;
    molIcon: string;
    molsId: number | null;
    created_at: string;
    updated_at: string;
}

export const MODULO_KEYS = [
    "molId",
    "empId",
    "molDes",
    "molIcon",
    "molsId",
    "created_at",
    "updated_at"
];
