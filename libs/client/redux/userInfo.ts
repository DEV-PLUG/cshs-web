import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StateType = {
  name: string,
  grade: number,
  class: number,
  number: number,
  type: number
} | null;

export const initialState:StateType = { name: "", grade: 0, class: 0, number: 0, type: 0 };

export const userInfo = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo: (state: StateType, action: PayloadAction<{ name:string, grade:number, class:number, number:number, type:number }>) => {
      return { name: action.payload.name, grade: action.payload.grade, class: action.payload.class, number: action.payload.number, type: action.payload.type }
    }
  }
});

export const { setUserInfo } = userInfo.actions;

export default userInfo;