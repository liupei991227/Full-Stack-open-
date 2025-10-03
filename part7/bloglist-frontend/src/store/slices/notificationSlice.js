import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: null, type: null }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return { message: action.payload.message, type: action.payload.type }
    },
    clearNotification() {
      return { message: null, type: null }
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions


export const showNotification = (message, type = 'success', seconds = 5) => dispatch => {
  dispatch(setNotification({ message, type }))
  setTimeout(() => dispatch(clearNotification()), seconds * 1000)
}

export default notificationSlice.reducer
