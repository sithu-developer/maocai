import { NewCategory } from "@/type/category";
import { envValues } from "@/util/envValues";
import { category } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";


interface InitialStateType {
    items : category[]
    error : Error | null
}

const initialState : InitialStateType = {
    items : [],
    error : null
}

export const createNewCategory = createAsyncThunk("categorySlice/createNewCategory" , async( newCategory : NewCategory , thunkApi ) => {
    const { name , url , companyId , isFail , isSuccess } = newCategory;
    try {
        const response = await fetch(`${envValues.apiUrl}/category` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ name , url , companyId })
        })
        const { newCategory } = await response.json();
        thunkApi.dispatch(addNewCategory(newCategory))
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }

})

const categorySlice = createSlice({
    name : "categorySlice",
    initialState , 
    reducers : {
        setCategories : ( state , action : PayloadAction<category[]>) => {
            state.items = action.payload;
        },
        addNewCategory : (state , action : PayloadAction<category> ) => {
            state.items = [...state.items , action.payload ]
        }

    }
});

export const { setCategories , addNewCategory } = categorySlice.actions;

export default categorySlice.reducer;