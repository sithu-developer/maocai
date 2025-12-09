import { food } from "@prisma/client"

export interface VoucherItem extends food {
    quantity : number
}