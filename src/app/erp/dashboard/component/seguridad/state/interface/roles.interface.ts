
export interface Roles{
    "rolId":number,
    "rolDes": string,
    "empId": number,
    "created_at": string,
    "updated_at": string
}

export const ROLES_KEYS: (keyof Roles )[] = [
    "rolId",
    "rolDes",
    "empId",
    "created_at",
    "updated_at"
];