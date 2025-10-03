import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './slices/notificationSlice'
import blogsReducer from './slices/blogsSlice'
import userReducer from './slices/userSlice'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    user: userReducer,
  }
})

export default store
