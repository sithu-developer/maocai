import { company } from "@prisma/client"
import { SuccessOrFailTypes } from "./category"

export interface NewCompany extends SuccessOrFailTypes {
    email : string
}

export interface UpdatedCompany extends company, SuccessOrFailTypes {}