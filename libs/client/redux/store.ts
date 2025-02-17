import { configureStore } from '@reduxjs/toolkit'
import notification from './notification'

export const makeStore = () => {
  return configureStore({
    reducer: {
      notification: notification.reducer,
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']