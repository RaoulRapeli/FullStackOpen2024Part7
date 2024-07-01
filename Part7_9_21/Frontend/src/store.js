import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogReducer from "./reducers/blogReducer";
import loginReducer from "./reducers/loginReducer";
import usersReducer from "./reducers/usersReducer";

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    login: loginReducer,
    notification: notificationReducer,
    users: usersReducer,
  },
});

export default store;
