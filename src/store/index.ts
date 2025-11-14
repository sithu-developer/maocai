import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from "./slice/category"
import companyReducer from "./slice/company"
import foodReducer from "./slice/food"

export const store = configureStore({
  reducer: {
    category : categoryReducer,
    company : companyReducer,
    food : foodReducer,
    
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch