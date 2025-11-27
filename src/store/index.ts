import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from "./slice/category"
import companyReducer from "./slice/company"
import foodReducer from "./slice/food"
import loadingReducer from "./slice/loading"
import tableReducer from "./slice/table"

export const store = configureStore({
  reducer: {
    category : categoryReducer,
    company : companyReducer,
    food : foodReducer,
    loading : loadingReducer,
    table : tableReducer,
    
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch