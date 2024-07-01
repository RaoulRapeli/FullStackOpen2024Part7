import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";

const loginSlice = createSlice({
  name: "login",
  initialState: [],
  reducers: {
    appendLogin(state, action) {
      state.push(action.payload);
    },
    setLogin(state, action) {
      return action.payload;
    },
  },
});

export const { appendLogin, setLogin } = loginSlice.actions;

export const newLogin = (content) => {
  return async (dispatch) => {
    const login = await loginService.login(content);
    dispatch(setLogin(login));
  };
};

export default loginSlice.reducer;
