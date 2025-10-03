import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import loginService from '../../services/login'
import blogsService from '../../services/blogs'

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, thunkAPI) => {
    const user = await loginService.login(credentials)

    blogsService.setToken(user.token)

    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    return user
  }
)

export const logoutUser = createAsyncThunk('user/logout', async () => {
  window.localStorage.removeItem('loggedBlogAppUser')
  blogsService.setToken(null)
  return null
})

const userSlice = createSlice({
  name: 'user',
  initialState: JSON.parse(window.localStorage.getItem('loggedBlogAppUser')) || null,
  reducers: {
    setUser(state, action) { return action.payload },
    clearUser(state, action) {
      window.localStorage.removeItem('loggedBlogAppUser')
      blogsService.setToken(null)
      return null
    }
  },

  extraReducers: builder => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => action.payload)
      .addCase(logoutUser.fulfilled, () => null)
  }
})
export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
