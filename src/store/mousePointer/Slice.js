import { createSlice } from '@reduxjs/toolkit'

const mousePointerSlice = createSlice({
  name: 'mousePointer',
  initialState: {
    intersects: [],
    selected: null
  },
  reducers: {
    addIntersects(state, action) {
      state.intersects = action.payload
    },
    setSelected(state, action) {
      state.selected = action.payload
    }
  }
})

export const { addIntersects, setSelected } = mousePointerSlice.actions

export default mousePointerSlice.reducer

