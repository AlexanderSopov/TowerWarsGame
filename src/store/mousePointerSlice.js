import { createSlice } from '@reduxjs/toolkit'

const mousePointerSlice = createSlice({
  name: 'mousePointer',
  initialState: {
    intersects: null,
    selected: null
  },
  reducers: {
    addIntersects(state, action) {
      state.intersects = action.payload
    },
    setSelected(state, action) {
      state.selected = action.payload
    },
    refreshState (state) {
      state.intersects = null
      state.selected = null
    }
  }
})

export const { addIntersects, setSelected, refreshState } = mousePointerSlice.actions

export default mousePointerSlice.reducer

