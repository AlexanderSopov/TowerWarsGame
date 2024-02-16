import { createSlice } from '@reduxjs/toolkit'
import { refreshState, setSelected } from './mousePointerSlice'
import { TowerOptions } from '/builders/TowerBuilders'

const initialState = {
  portrait: {
    image: false,
    animation: false,
    health: false,
    mana: false,
  },
  stats: {
    name: null,
    stats: []
  },
  options: [
    ...TowerOptions
  ]
}
const commandPanelSlice = createSlice({
  name: 'commandPanel',
  initialState: {
    ...initialState
  },
  reducers: {
    setCommandPanelData(state, action) {
      if (!action.payload)
        state = { ...initialState }
      return action.payload
    },
    clearCommandPanel (state) {
      return initialState
    },
  },
  extraReducers: builder => {
    builder.addCase(setSelected, (state, action) => {
      if (!action.payload) {
        return initialState
      }
    })
    builder.addCase(refreshState, (state, action) => {
      if (!action.payload) {
        return initialState
      }
    })
  }
})

export const { setCommandPanelData, clearCommandPanel } = commandPanelSlice.actions

export default commandPanelSlice.reducer
