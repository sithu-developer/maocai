import { food } from "@prisma/client"
import { SuccessOrFailTypes } from "./category"

export interface VoucherItem extends food {
    quantity : number
}

interface SelectedFoodAndQty {
    foodId : string;
    quantity : number;
}

export interface NewOrder extends SuccessOrFailTypes {
    tableId : string;
    selectedFoods : SelectedFoodAndQty[]
}