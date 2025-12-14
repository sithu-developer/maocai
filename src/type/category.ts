import { category } from "@prisma/client";

export interface SuccessOrFailTypes {
    isSuccess ?: ( value ?: unknown ) => void;
    isFail ?: ( value ?: unknown ) => void;
}

export interface NewCategory extends SuccessOrFailTypes  {
    name : string
    url : string
    companyId : string
    isMainDish : boolean
}

export interface UpdatedCategory extends category , SuccessOrFailTypes {}

export interface DeleteCategory extends SuccessOrFailTypes {
    id : string;
}