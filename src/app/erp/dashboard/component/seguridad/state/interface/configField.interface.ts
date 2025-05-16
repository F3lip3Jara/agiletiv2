export interface ConfigField {
    id: number;
    table_name: string;
    field_name: string;
    label: string;
    description: string;
    data_type: string;
    options: string;
    is_filterable: boolean;
}

export const CONFIG_FIELD_KEYS = [
    'table_name',
    'field_name',
    'label',
    'description',
    'data_type',
    'options',
    'is_filterable',
    'id'

];
