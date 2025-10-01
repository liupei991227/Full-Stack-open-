import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

// const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    // voteAnecdote(state, action) {
    //   const id = action.payload
    //   const anecdote = state.find(a => a.id === id)
    //   if (anecdote) {
    //     anecdote.votes += 1
    //   }
    // },
    // createAnecdote(state, action) {
    //   state.push(action.payload)
      // const content = action.payload
      // state.push({
      //   content,
      //   id: getId(),
      //   votes: 0
      // })
    // },
    appendAnecdotes(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      return state.map(a => a.id === updated.id ? updated : a)
    }
  }
})

export const { appendAnecdotes, setAnecdotes, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}


export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdotes(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updated = await anecdoteService.updateAnecdote(anecdote)
    dispatch(updateAnecdote(updated))
  }
}

export default anecdoteSlice.reducer




// export const voteAnecdote = (id) => {
//   return {
//     type: 'VOTE',
//     payload: id
//   }
// }

// export const createAnecdote = (content) => {
//   return {
//     type: 'NEW_ANECDOTE',
//     payload: {
//       content,
//       id: getId(),
//       votes: 0
//     }
//   }
// }



// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'VOTE':
//       const id = action.payload
//       return state.map(anecdote =>
//         anecdote.id === id
//           ? { ...anecdote, votes: anecdote.votes + 1 }
//           : anecdote
//       )
//     case 'NEW_ANECDOTE':

//       return [...state, action.payload]
//     default:
//       return state
//   }

// }

// export default reducer