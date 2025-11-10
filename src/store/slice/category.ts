import { NewCategory } from "@/type/category";
import { envValues } from "@/util/envValues";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InitialStateType {
    items : []
}

const initialState = {
    items : []
}

export const createNewCategory = createAsyncThunk("categorySlice/createNewCategory" , async( newCategory : NewCategory , thunkApi ) => {
    const { name , url , isFail , isSuccess } = newCategory;
    try {
        const response = await fetch(`${envValues.apiUrl}/category` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ name , url })
        })
        const { isDone } = await response.json();
        console.log("here " , isDone)
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }

})

const categorySlice = createSlice({
    name : "categorySlice",
    initialState , 
    reducers : {}
});

export default categorySlice.reducer;

// npm i prisma --save-dev