import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export const { appendBlog, setBlogs } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    blogs.sort((a, b) => b.likes - a.likes);
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content);
    dispatch(appendBlog(newBlog));
  };
};

export const likeBlog = (id) => {
  {
    return async (dispatch) => {
      var blogs = await blogService.getAll();
      var newBlog = blogs.find((value) => value.id === id);
      var tempData = JSON.parse(JSON.stringify(newBlog));
      var tempID = tempData.id;
      var tempUser = tempData.user;
      newBlog.likes++;
      const upadtedBlog = await blogService.update(id, newBlog);
      upadtedBlog.id = tempID;
      upadtedBlog.user = tempUser;
      dispatch(
        setBlogs(
          blogs
            .map((blog) => (blog.id !== undefined ? blog : upadtedBlog))
            .sort((a, b) => b.likes - a.likes),
        ),
      );
    };
  }
};

export const addComment = (content) => {
  {
    return async (dispatch) => {
      var blogs = await blogService.getAll();
      var newBlog = blogs.find((value) => value.id === content.id);
      var tempData = JSON.parse(JSON.stringify(newBlog));
      var tempID = tempData.id;
      var tempUser = tempData.user;
      delete content.id;
      delete content.user;
      const upadtedBlog = await blogService.update(tempID, content);
      upadtedBlog.id = tempID;
      upadtedBlog.user = tempUser;
      dispatch(
        setBlogs(
          blogs
            .map((blog) => (blog.id !== tempID ? blog : upadtedBlog))
            .sort((a, b) => b.likes - a.likes),
        ),
      );
    };
  }
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    var blogs = await blogService.getAll();
    await blogService.remove(id);
    dispatch(
      setBlogs(
        blogs
          .filter((blog) => blog.id !== id)
          .sort((a, b) => b.likes - a.likes),
      ),
    );
  };
};

export default blogSlice.reducer;
