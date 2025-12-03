import { CustomerCheckItems, DeleteTable, NewTable, UpdateTable } from "@/type/table";
import { envValues } from "@/util/envValues";
import { tables } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setCompany } from "./company";
import { setCategories } from "./category";
import { setFoods } from "./food";

interface TableSliceInitialState {
    items : tables[]
    error : Error | null
}

const initialState : TableSliceInitialState = {
    items : [],
    error : null
}

export const customerCheck = createAsyncThunk("tableSlice/customerCheck" , async( checkItems : CustomerCheckItems , thunkApi ) => {
    const { companyId , tableId , isFail , isSuccess } = checkItems;
    try {
        const response = await fetch(`${envValues.apiUrl}/table?companyId=${companyId}&tableId=${tableId}`);
        const { company , categories , foods } = await response.json();
        thunkApi.dispatch(setCompany(company));
        thunkApi.dispatch(setCategories(categories));
        thunkApi.dispatch(setFoods(foods));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
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

export const updateTable = createAsyncThunk("tableSlice/updateTable" , async( tableToUpdate : UpdateTable , thunkApi ) => {
    const { id , tableName , isFail , isSuccess } = tableToUpdate;
    try {
        const response = await fetch(`${envValues.apiUrl}/table` , {
            method : "PUT",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({ id , tableName })
        });
        const { updatedTable } = await response.json();
        thunkApi.dispatch(replaceTable(updatedTable));
        if(isSuccess) {
            isSuccess();
        }
    } catch(err) {
        if(isFail) {
            isFail();
        }
    }
})

export const deleteTable = createAsyncThunk("" , async( tableToDelete : DeleteTable , thunkApi ) => {
    const { id , isFail , isSuccess } = tableToDelete;
    try {
        const response = await fetch(`${envValues.apiUrl}/table?id=${id}` , {
            method : "DELETE"
        });
        const { deletedTable } = await response.json();
        thunkApi.dispatch(removeTable(deletedTable));
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
        },
        replaceTable : ( state , action : PayloadAction<tables>) => {
            state.items = state.items.map(item => (item.id === action.payload.id ? action.payload : item) );
        },
        removeTable : ( state , action : PayloadAction<tables>) => {
            state.items = state.items.filter(item => item.id !== action.payload.id );
        }
    }
});

export const { setTables , addTable , replaceTable , removeTable } = tableSlice.actions;

export default tableSlice.reducer;