// import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'

import store from './store'


// const store = configureStore({
//   reducer: {
//     anecdotes: anecdoteReducer,
//     filter: filterReducer,
//     notification: notificationReducer,
//   }
// })

// anecdoteService.getAll().then(anecdotes => {
//   store.dispatch(setAnecdotes(anecdotes))
// })

// console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)