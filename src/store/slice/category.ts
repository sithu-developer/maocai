import { createSlice } from "@reduxjs/toolkit";

interface InitialStateType {
    items : []
}

const initialState = {
    items : []
}

const categorySlice = createSlice({
    name : "categorySlice",
    initialState , 
    reducers : {}
});

export default categorySlice.reducer;

// npm i prisma --save-dev