import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import blogsService from '../../services/blogs'


export const initializeBlogs = createAsyncThunk(
  'blogs/fetchAll',
  async () => {
    const blogs = await blogsService.getAll()
    return blogs
  }
)

export const createBlog = createAsyncThunk(
  'blogs/create',
  async (blogData, thunkAPI) => {
    const state = thunkAPI.getState()

    if (state.user?.token) {
      blogsService.setToken(state.user.token)
    }
    const created = await blogsService.create(blogData)

    return created
  }
)

export const likeBlog = createAsyncThunk(
  'blogs/like',
  async ({ id, updatedBlog }, thunkAPI) => {
    const returned = await blogsService.update(id, updatedBlog)
    return returned
  }
)

export const removeBlog = createAsyncThunk(
  'blogs/remove',
  async (id, thunkAPI) => {
    const state = thunkAPI.getState()
    if (state.user?.token) blogsService.setToken(state.user.token)
    await blogsService.remove(id)
    return id
  }
)

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {

  },
  extraReducers: builder => {
    builder
      .addCase(initializeBlogs.fulfilled, (state, action) => action.payload)
      .addCase(createBlog.fulfilled, (state, action) => state.concat(action.payload))
      .addCase(likeBlog.fulfilled, (state, action) => state.map(b => b.id === action.payload.id ? action.payload : b))
      .addCase(removeBlog.fulfilled, (state, action) => state.filter(b => b.id !== action.payload))
  }
})

export default blogsSlice.reducer
