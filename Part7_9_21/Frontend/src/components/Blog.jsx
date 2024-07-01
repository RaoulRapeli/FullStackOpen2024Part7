import { likeBlog, deleteBlog, addComment } from "../reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import { useMatch, Link, json } from "react-router-dom";
import { useState } from "react";
import Button from "react-bootstrap/Button";

const Blog = () => {
  const match = useMatch("/blogs/:id");
  const blog = useSelector(({ blogs }) => {
    return blogs.find((blog) => blog.id === match.params.id);
  });

  const user = useSelector(({ login }) => {
    return login;
  });

  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");

  const blogStyle = {
    paddingTop: 2,
    paddingLeft: 5,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const marginLeft = {
    marginLeft: 5,
  };

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
  const handleLike = () => {
    dispatch(likeBlog(blog.id));
    dispatch(
      setNotification({
        message: `blog ${blog.title} by ${blog.author} likes has been updated`,
        messageTime: 5,
        messageType: successStyle,
      }),
    );
  };

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id));
      dispatch(
        setNotification({
          message: `blog ${blog.title} by ${blog.author} has been removed`,
          messageTime: 5,
          messageType: successStyle,
        }),
      );
    }
  };

  const handleAddComment = (event) => {
    event.preventDefault();
    var tempBlog = JSON.parse(JSON.stringify(blog));
    var tempComment = JSON.parse(JSON.stringify(newComment));
    tempBlog.comments.push(tempComment);
    dispatch(addComment(tempBlog));
    dispatch(
      setNotification({
        message: `new comment added`,
        messageTime: 5,
        messageType: successStyle,
      }),
    );
    setNewComment("");
  };

  if (!blog) {
    return null;
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        <h2>
          {blog.title} {blog.author}
        </h2>
      </div>
      <div className="toggleInformation">
        <div>
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </div>
        <div>
          <span className="amountOfLikes" target="_blank">
            {blog.likes}
          </span>
          <Button
            variant="success"
            size="sm"
            style={marginLeft}
            onClick={() => handleLike()}
            className="likeButton"
          >
            like
          </Button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.username === user.username ? (
          <div>
            <Button variant="danger" size="sm" onClick={() => handleDelete()}>
              remove
            </Button>
          </div>
        ) : null}
        <div>
          <h3>commnets</h3>
          <div>
            <form onSubmit={handleAddComment}>
              <input
                type="text"
                value={newComment}
                onInput={(e) => setNewComment(e.target.value)}
              />
              <Button type="submit" variant="success" size="sm">
                add comment
              </Button>
            </form>
          </div>
          <ul>
            {blog.comments.map((comment) => {
              return <li key={blog.id + comment}>{comment}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blog;
