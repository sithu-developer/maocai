import { NewTable } from "@/type/table";
import { envValues } from "@/util/envValues";
import { tables } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TableSliceInitialState {
    items : tables[]
    error : Error | null
}

const initialState : TableSliceInitialState = {
    items : [],
    error : null
}

export const customerCheck = createAsyncThunk("tableSlice/customerCheck" , async( checkItems , thunkApi ) => {
    // here tableId and companyId fetch

})

export const createTable = createAsyncThunk("tableSlice/createTable" , async( tableToCreate : NewTable , thunkApi ) => {
    const { tableName , imageUrl , companyId , isFail , isSuccess } = tableToCreate;
    try {
        const response = await fetch(`${envValues.apiUrl}/table` , {
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ tableName , imageUrl , companyId })
        });
        const { newTable } = await response.json();
        thunkApi.dispatch(addTable(newTable))
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
})

const tableSlice = createSlice({
    name : "table slice",
    initialState ,
    reducers : {
        setTables : ( state , action : PayloadAction<tables[]>) => {
            state.items = action.payload;
        },
        addTable : ( state , action : PayloadAction<tables> ) => {
            state.items = [ ...state.items , action.payload ]
        }
    }
});

export const { setTables , addTable } = tableSlice.actions;

export default tableSlice.reducer;