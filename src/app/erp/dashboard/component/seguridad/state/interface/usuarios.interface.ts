
export interface Usuario{
        "empId"         : number,
        "empresa"       :string,
        "rolId"         : number,
        "id"            : number,
        "name"          : string,
        "email"         : string,
        "rolDes"        : string,
        "emploNom"      : string,
        "emploApe"      : string,
        "emploFecNac"   : string,
        "gerId"         : number,
        "gerDes"        : string,
        "activado"      : string,
        "reinicio"      : string,
        "created_at"    : string
}

export interface CreateUsuario{
        'name'          : string,      
        'rol'           : number,
        'gerId'         : number,
        'empName'       : string,
        'emploApe'      : string,
        'emploFecNac'   : Date,
        'emploAvatar'   : string,
        'empId'         : number,
         
}

export interface UpdateUsuario{
        'id'            : number,
        'rol'           : number,
        'gerId'         : number,
        'empName'       : string,
        'emploApe'      : string,
        'emploFecNac'   : Date,
        'emploAvatar'   : string,
        'empId'         : number,
        'password'      : string,
        'mantenerPassword': number,
         
}

export interface getUsuario{
        'id'            : number,
        'gerId'         : number,
        'emploAvatar'   : string        
}

export const USUARIO_KEYS: (keyof Usuario)[] = [
    "empId",
    "empresa",
    "rolId",
    "id",
    "name",
    "email",
    "rolDes",
    "emploNom",
    "emploApe",
    "emploFecNac",
    "gerId",
    "gerDes",
    "activado",
    "reinicio",
    "created_at"
  ];