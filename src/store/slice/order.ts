import { NewOrder, UpdatedOrder } from "@/type/order";
import { envValues } from "@/util/envValues";
import { order } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderSliceInitialState {
    items : order[],
    error : Error | null
}

const initialState : OrderSliceInitialState = {
    items : [],
    error : null
}

export const orderFoods = createAsyncThunk("" , async( orderToCreate : NewOrder , thunkApi ) => {
    const { tableId , selectedFoods , isFail , isSuccess } = orderToCreate;
    try {
        const response = await fetch(`${envValues.apiUrl}/order` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ tableId , selectedFoods })
        });
        const { newOrders } = await response.json();
        thunkApi.dispatch(setOrders(newOrders));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
})

export const updateOrder = createAsyncThunk("" , async( orderToUpdate : UpdatedOrder , thunkApi ) => {
    const { orderSeq , status , isFail , isSuccess } = orderToUpdate;
    try {
        const response = await fetch(`${envValues.apiUrl}/order` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ orderSeq , status })
        })
        const {} = await response.json();
        
    } catch(err) {

    }
})

const orderSlice = createSlice({
    name : "order slice",
    initialState,
    reducers : {
        setOrders : ( state , action : PayloadAction<order[]> ) => {
            state.items = action.payload;
        }
    }
})

export const { setOrders } = orderSlice.actions;

export default orderSlice.reducer;