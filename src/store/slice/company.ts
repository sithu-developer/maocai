import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewCompany } from "@/type/company";
import { envValues } from "@/util/envValues";
import { company } from "@prisma/client";
import { setCategories } from "./category";

interface InitialStateType {
    item : company | null
    error : Error | null
}

const initialState : InitialStateType = {
    item : null,
    error : null
}

export const companyCheck = createAsyncThunk("companySlice/companyCheck" , async( newCompany : NewCompany , thunkApi ) => {
    const { email , isFail , isSuccess } = newCompany;
    try {
        const response = await fetch(`${envValues.apiUrl}/company` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ email })
        });
        const {company , categories} = await response.json();
        thunkApi.dispatch(setCompany(company));
        thunkApi.dispatch(setCategories(categories));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
})

const companySlice = createSlice({
    name : "companySlice",
    initialState ,
    reducers : {
        setCompany : ( state , action : PayloadAction<company> ) => {
            state.item = action.payload;
        }
    }
})

export const { setCompany } = companySlice.actions;
export default companySlice.reducer;