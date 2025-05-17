import { configureStore } from '@reduxjs/toolkit'
import notification from './notification'
import userInfo from './userInfo'

export const makeStore = () => {
  return configureStore({
    reducer: {
      notification: notification.reducer,
      userInfo: userInfo.reducer,
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']