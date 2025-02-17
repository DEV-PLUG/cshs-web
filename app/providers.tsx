'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@libs/client/redux/store'
import { setNotification, initialState } from '@libs/client/redux/notification'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
    storeRef.current.dispatch(setNotification({ type: "success", text: "" }))
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}