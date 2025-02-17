import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StateType = {
  type: "success" | "warning" | "error" | "info",
  text: string
} | null;

export const initialState:StateType = { type: "success", text: "" };

export const notification = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state: StateType, action: PayloadAction<{ type: "success" | "warning" | "error" | "info", text: string }>) => {
      return { type: action.payload.type, text: action.payload.text }
    }
  }
});

export const { setNotification } = notification.actions;

export default notification;