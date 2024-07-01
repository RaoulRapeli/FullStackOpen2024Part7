import { useDispatch, useSelector } from "react-redux";
import { useMatch } from "react-router-dom";

const User = () => {
  const match = useMatch("/users/:id");
  const dispatch = useDispatch();
  const user = useSelector(({ users }) => {
    return users.find((user) => user.id === match.params.id);
  });

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <div>
        <ul>
          {user.blogs.map((blog) => {
            return <li key={blog.id}>{blog.title}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default User;
