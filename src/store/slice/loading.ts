import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateType {
    isLoading : boolean,

}

const initialState : InitialStateType  = {
    isLoading : false
}

const loadingSlice = createSlice({
    name : "loading slice",
    initialState,
    reducers : {
        changeLoading : ( state , action : PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
});

export const { changeLoading } = loadingSlice.actions;

export default loadingSlice.reducer;