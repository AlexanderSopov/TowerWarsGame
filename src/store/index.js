import { configureStore } from '@reduxjs/toolkit'
import mousePointerReducer from './mousePointer/Slice'

export const store = configureStore({
  reducer: {
    mousePointer: mousePointerReducer,
  }
})
