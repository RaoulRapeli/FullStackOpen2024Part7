import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BlogForm from "./blogForm";
import { initializeBlogs } from "../reducers/blogReducer";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector(({ login }) => {
    return login;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs());
    }
  }, [user]);

  const blogs = useSelector(({ blogs }) => {
    return blogs;
  });

  const successStyle = {
    color: "green",
    backgroundColor: "lightgray",
    border: "3px solid green",
    borderRadius: "3px",
    padding: "10px",
    fontSize: "18px",
  };

  const warningtStyle = {
    color: "red",
    backgroundColor: "lightgray",
    border: "3px solid red",
    borderRadius: "3px",
    padding: "10px",
    fontSize: "18px",
  };

  return (
    <div>
      <h2>blogs</h2>
      {user && <BlogForm />}
      <div className="blogList">
        {user &&
          blogs.map((blog) => (
            <div key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Blogs;
