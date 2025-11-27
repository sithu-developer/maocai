import { tables } from "@prisma/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

const tableSlice = createSlice({
    name : "table slice",
    initialState ,
    reducers : {}
});

export default tableSlice.reducer;