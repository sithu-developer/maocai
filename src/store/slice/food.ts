import { DeleteFood, NewFood, UpdatedFood } from "@/type/food";
import { envValues } from "@/util/envValues";
import { category, food } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeOrdersFromDeletingFood } from "./order";

interface InitialStateType {
    items : food[],
    error : Error | null
}

const initialState : InitialStateType = {
    items : [],
    error : null
}

export const createNewFood = createAsyncThunk("foodSlice/createNewFood" , async( newFood : NewFood , thunkApi ) => {
    const { name , price , url , categoryId , isSuccess , isFail } = newFood;
    try {
        const response = await fetch(`${envValues.apiUrl}/food` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ name , price , url , categoryId })
        });
        const { createdFood } = await response.json();
        thunkApi.dispatch(addFood(createdFood))
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
})

export const updateFood = createAsyncThunk("foodSlice/updateFood" , async( foodToUpdate : UpdatedFood , thunkApi ) => {
    const { id , name , price , url , categoryId , isFail , isSuccess } = foodToUpdate;
    try {
        const response = await fetch(`${envValues.apiUrl}/food` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , name , price , url , categoryId })
        });
        const { updatedFood } = await response.json();
        thunkApi.dispatch(replaceFood(updatedFood));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
})

export const deleteFood = createAsyncThunk("foodSlice/deleteFood" , async( foodToDelete : DeleteFood , thunkApi ) => {
    const { id , isFail , isSuccess } = foodToDelete;
    try {
        const response = await fetch(`${envValues.apiUrl}/food?id=${id}`, {
            method : "DELETE"
        });
        const { deletedFood } = await response.json();
        thunkApi.dispatch(removeOrdersFromDeletingFood(deletedFood));
        thunkApi.dispatch(removeFood(deletedFood));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
})

const foodSlice = createSlice({
    name : "foodSlice",
    initialState ,
    reducers : {
        setFoods : ( state , action : PayloadAction<food[]>) => {
            state.items = action.payload;
        },
        addFood : ( state , action : PayloadAction<food>) => {
            state.items = [ ...state.items , action.payload ]
        },
        replaceFood : ( state , action : PayloadAction<food>) => {
            state.items = state.items.map(item => (item.id === action.payload.id) ? action.payload : item )
        },
        removeFood : ( state , action : PayloadAction<food> ) => {
            state.items = state.items.filter(item => item.id !== action.payload.id );
        },
        removeFoodsFromCategory : ( state , action : PayloadAction<category> ) => {
            state.items = state.items.filter(item => item.categoryId !== action.payload.id );
        }
    }
})

export const { addFood , setFoods , replaceFood , removeFood , removeFoodsFromCategory } = foodSlice.actions;

export default foodSlice.reducer;