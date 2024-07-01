import { createSlice } from "@reduxjs/toolkit";
import usersService from "../services/users";

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    appendUsers(state, action) {
      state.push(action.payload);
    },
    setUsers(state, action) {
      return action.payload;
    },
  },
});

export const { appendUsers, setUsers } = usersSlice.actions;

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await usersService.getAll();
    dispatch(setUsers(users));
  };
};

export default usersSlice.reducer;
