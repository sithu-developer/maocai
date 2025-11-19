import { DeleteCategory, NewCategory, UpdatedCategory } from "@/type/category";
import { envValues } from "@/util/envValues";
import { category } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeFoodsFromCategory } from "./food";


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

export const updateCategory = createAsyncThunk("categorySlice/updateCategory" , async( categoryToUpdate : UpdatedCategory , thunkApi ) => {
    const { id , name , url , companyId , isFail , isSuccess } = categoryToUpdate;
    try {
        const response = await fetch(`${envValues.apiUrl}/category` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , name , url , companyId })
        });
        const { updatedCategory } = await response.json();
        thunkApi.dispatch(replaceCategory(updatedCategory))
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
})

export const deleteCategory = createAsyncThunk("categorySlice/deleteCategory" , async( categoryToDelete : DeleteCategory , thunkApi ) => {
    const { id , isFail , isSuccess } = categoryToDelete;
    try {
        const response = await fetch(`${envValues.apiUrl}/category?id=${id}` , {
            method : "DELETE",
        });
        const { deletedCategory } = await response.json();
        thunkApi.dispatch(removeFoodsFromCategory(deletedCategory))
        thunkApi.dispatch(removeCategory(deletedCategory))
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
        },
        replaceCategory : ( state , action : PayloadAction<category> ) => {
            state.items = state.items.map(item => (item.id === action.payload.id) ? action.payload : item);
        },
        removeCategory : ( state , action : PayloadAction<category> ) => {
            state.items = state.items.filter(item => item.id !== action.payload.id );
        }
    }
});

export const { setCategories , addNewCategory , replaceCategory , removeCategory } = categorySlice.actions;

export default categorySlice.reducer;