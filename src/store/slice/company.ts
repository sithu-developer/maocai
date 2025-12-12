import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewCompany, UpdatedCompany } from "@/type/company";
import { envValues } from "@/util/envValues";
import { company } from "@prisma/client";
import { setCategories } from "./category";
import { setFoods } from "./food";
import { setTables } from "./table";
import { setOrders } from "./order";

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
        const {company , categories , foods , tables , orders } = await response.json();
        thunkApi.dispatch(setCompany(company));
        thunkApi.dispatch(setCategories(categories));
        thunkApi.dispatch(setFoods(foods))
        thunkApi.dispatch(setTables(tables))
        thunkApi.dispatch(setOrders(orders))
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
})

export const updateCompany = createAsyncThunk("companySlice/updateCompany" , async( companyToUpdate : UpdatedCompany , thunkApi ) => {
    const { id , name , email , isSuccess , isFail } = companyToUpdate;
    try {
        const response = await fetch(`${envValues.apiUrl}/company` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , name , email })
        });
        const { updatedCompany } = await response.json();
        thunkApi.dispatch(setCompany(updatedCompany))
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
        },
    }
})

export const { setCompany } = companySlice.actions;
export default companySlice.reducer;