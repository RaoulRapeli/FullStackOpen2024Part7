import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import blogService from "./services/blogs";
import Notification from "./components/Notification";
import { setNotification } from "./reducers/notificationReducer";
import { newLogin, setLogin } from "./reducers/loginReducer";
import Users from "./components/Users";
import Blogs from "./components/Blogs";
import User from "./components/User";
import Blog from "./components/Blog";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const user = useSelector(({ login }) => {
    if (login.length !== 0) {
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(login));
      blogService.setToken(login.token);
      return login;
    } else {
      return null;
    }
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const tempUser = JSON.parse(loggedUserJSON);
      dispatch(setLogin(tempUser));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      dispatch(newLogin({ username, password }));
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(
        setNotification({
          message: `wrong username or password'`,
          messageTime: 5,
          messageType: warningtStyle,
        }),
      );
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(setLogin(""));
    navigate("/");
  };

  const loginForm = () => (
    <>
      <div>
        <h2>Log in to application</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="1">
              username
            </Form.Label>
            <Col sm="3">
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                name="Username"
                id="username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="1">
              password
            </Form.Label>
            <Col sm="3">
              <Form.Control
                type="password"
                placeholder="Enter username"
                value={password}
                name="Password"
                id="password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </Col>
          </Form.Group>
          <Button variant="primary" type="submit" id="login-button">
            login
          </Button>{" "}
        </Form>
      </div>
    </>
  );

  return (
    <div>
      <Notification />
      <div>
        {user ? (
          <span style={{ display: "flex" }}>
            <Link to="/blogs">blogs</Link>
            <Link style={{ marginLeft: 10, marginRight: 10 }} to="/users">
              users
            </Link>
            {user.name} logged in
            <form onSubmit={handleLogout}>
              <Button variant="primary" size="sm" type="submit">
                logout
              </Button>
            </form>
          </span>
        ) : null}
      </div>
      {!user && loginForm()}
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </div>
  );
};

export default App;
