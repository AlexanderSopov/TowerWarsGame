import { configureStore } from '@reduxjs/toolkit'
import mousePointerReducer from './mousePointerSlice'
import commandPanelReducer from './commandPanelSlice'
import { tileSerializationMiddleware } from './worldSlice'
import worldReducer from './worldSlice'

export const store = configureStore({
  reducer: {
    commandPanel: commandPanelReducer,
    mousePointer: mousePointerReducer,
    world: worldReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: true
  }).concat(tileSerializationMiddleware)
})
