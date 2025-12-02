import { SuccessOrFailTypes } from "./category"

export interface NewTable extends SuccessOrFailTypes {
    tableName : string
    imageUrl : string
    companyId : string
}

export interface UpdateTable extends SuccessOrFailTypes {
    id : string;
    tableName : string;
}

export interface DeleteTable extends SuccessOrFailTypes {
    id : string;
}