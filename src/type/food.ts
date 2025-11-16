import { food } from "@prisma/client"
import { SuccessOrFailTypes } from "./category"

export interface NewFood extends SuccessOrFailTypes {
    name : string
    price : number
    url : string
    categoryId : string
}

export interface UpdatedFood extends food , SuccessOrFailTypes {}

export interface DeleteFood extends SuccessOrFailTypes {
    id : string
}