import { SuccessOrFailTypes } from "./category"

export interface NewTable extends SuccessOrFailTypes {
    tableName : string
    imageUrl : string
    companyId : string
}