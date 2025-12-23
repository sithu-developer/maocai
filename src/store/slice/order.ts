import { CustomerOrderCheckItemType, DeletedOrder, NewOrder, UpdatedOrder } from "@/type/order";
import { envValues } from "@/util/envValues";
import { food, order, tables } from "@prisma/client";
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
        if(tableId) { // from orderlist customer
            const response = await fetch(`${envValues.apiUrl}/order?tableId=${tableId}`);
            const { activeOrders } = await response.json();
            thunkApi.dispatch(setOrders(activeOrders));
        }
        if(companyId) { // from order admin
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

export const deleteOrder = createAsyncThunk("orderSlice/deleteOrder" , async( orderToDelete : DeletedOrder , thunkApi ) => {
    const { orderSeq , isFail , isSuccess } = orderToDelete;
    try {
        const response = await fetch(`${envValues.apiUrl}/order?orderSeq=${orderSeq}` , {
            method : "DELETE"
        });
        const { isDone } = await response.json();
        if(isDone) {
            thunkApi.dispatch(removeOrdersFromAdmin(orderSeq))
            if(isSuccess) {
                isSuccess();
            }
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
            state.items = state.items.filter(item => item.tableId !== action.payload.id );
        },
        removeOrdersFromAdmin : ( state , action : PayloadAction<string>) => {
            state.items = state.items.filter(item => item.orderSeq !== action.payload);
        },
        removeOrdersFromDeletingCategory : ( state , action : PayloadAction<food[]> ) => {
            const deletedFoodIds = action.payload.map(item => item.id)
            state.items = state.items.filter(item => !deletedFoodIds.includes(item.foodId))
        },
        removeOrdersFromDeletingFood : ( state , action : PayloadAction<food> ) => {
            state.items = state.items.filter(item => item.foodId !== action.payload.id );
        }
    }
})

export const { setOrders , replaceOrders , removeOrdersFromTable , removeOrdersFromAdmin , removeOrdersFromDeletingCategory , removeOrdersFromDeletingFood } = orderSlice.actions;

export default orderSlice.reducer;