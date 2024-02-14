import { configureStore } from '@reduxjs/toolkit'
import mousePointerReducer from './mousePointerSlice'
import commandPanelReducer from './commandPanelSlice'

export const store = configureStore({
  reducer: {
    commandPanel: commandPanelReducer,
    mousePointer: mousePointerReducer,
  }
})
