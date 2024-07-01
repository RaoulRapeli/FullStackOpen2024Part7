import { useState } from "react";
import { createBlog } from "../reducers/blogReducer";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const BlogForm = () => {
  const dispatch = useDispatch();
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [toggleCreateBlogView, setToggleCreateBlogView] = useState(false);

  const handleAddBlog = (event) => {
    event.preventDefault();
    var newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      comments: [],
      likes: 0,
    };
    dispatch(createBlog(newBlog));
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
    setToggleCreateBlogView(false);
  };

  return (
    <>
      <div>
        <h2>create new</h2>
      </div>
      {toggleCreateBlogView ? (
        <>
          <Form onSubmit={handleAddBlog}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="1">
                title:
              </Form.Label>
              <Col sm="3">
                <Form.Control
                  type="text"
                  value={newTitle}
                  placeholder="insert title"
                  id="titleInput"
                  onChange={(event) => setNewTitle(event.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="1">
                author:
              </Form.Label>
              <Col sm="3">
                <Form.Control
                  type="text"
                  value={newAuthor}
                  placeholder="insert author"
                  id="authorInput"
                  onChange={(event) => setNewAuthor(event.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm="1">
                url:
              </Form.Label>
              <Col sm="3">
                <Form.Control
                  type="text"
                  value={newTitle}
                  placeholder="insert title"
                  id="titleInput"
                  onChange={(event) => setNewTitle(event.target.value)}
                />
              </Col>
            </Form.Group>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              id="createBlogButton"
            >
              create
            </Button>
          </Form>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setToggleCreateBlogView(false)}
          >
            cancel
          </Button>
        </>
      ) : (
        <Button
          variant="primary"
          size="sm"
          onClick={() => setToggleCreateBlogView(true)}
        >
          new blog
        </Button>
      )}
    </>
  );
};

export default BlogForm;
