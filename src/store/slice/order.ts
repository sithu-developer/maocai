import { CustomerOrderCheckItemType, NewOrder, UpdatedOrder } from "@/type/order";
import { envValues } from "@/util/envValues";
import { order, tables } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderSliceInitialState {
    items : order[],
    error : Error | null
}

const initialState : OrderSliceInitialState = {
    items : [],
    error : null
}

export const checkOrders = createAsyncThunk("orderSlice/checkOrders" , async( customerOrderCheckItem : CustomerOrderCheckItemType , thunkApi ) => {
    const { tableId , companyId , isFail , isSuccess } = customerOrderCheckItem;
    try {
        if(tableId) {
            const response = await fetch(`${envValues.apiUrl}/order?tableId=${tableId}`);
            const { activeOrders } = await response.json();
            thunkApi.dispatch(setOrders(activeOrders));
        }
        if(companyId) {
            const response = await fetch(`${envValues.apiUrl}/order?companyId=${companyId}`);
            const { activeOrders } = await response.json();
            thunkApi.dispatch(setOrders(activeOrders));
        }
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
})

export const orderFoods = createAsyncThunk("orderSlice/orderFoods" , async( orderToCreate : NewOrder , thunkApi ) => {
    const { tableId , selectedFoods , spicyLevel , isFail , isSuccess } = orderToCreate; 
    try {
        const response = await fetch(`${envValues.apiUrl}/order` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ tableId , selectedFoods , spicyLevel })
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

export const updateOrder = createAsyncThunk("orderSlice/updateOrder" , async( orderToUpdate : UpdatedOrder , thunkApi ) => {
    const { orderSeq , status , isFail , isSuccess } = orderToUpdate;
    try {
        const response = await fetch(`${envValues.apiUrl}/order` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ orderSeq , status })
        })
        const { updatedOrders } = await response.json();
        thunkApi.dispatch(replaceOrders(updatedOrders));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
})

const orderSlice = createSlice({
    name : "order slice",
    initialState,
    reducers : {
        setOrders : ( state , action : PayloadAction<order[]> ) => {
            state.items = action.payload;
        },
        replaceOrders : ( state , action : PayloadAction<order[]> ) => {
            const removeIds = action.payload.map(item => item.id)
            state.items = [...state.items.filter(item => !removeIds.includes(item.id) ) , ...action.payload ]
        },
        removeOrdersFromTable : ( state , action : PayloadAction<tables>) => {
            state.items = state.items.filter(item => item.tableId !== action.payload.id )
        }
    }
})

export const { setOrders , replaceOrders , removeOrdersFromTable } = orderSlice.actions;

export default orderSlice.reducer;