import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUsers } from "../reducers/usersReducer";
import { Link } from "react-router-dom";

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(({ users }) => {
    return users;
  });
  useEffect(() => {
    dispatch(initializeUsers());
  }, []);

  return (
    <div className="users">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
