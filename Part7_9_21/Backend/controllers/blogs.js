const blogsRouter = require("express").Router();
const { compareSync } = require("bcrypt");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (body.title !== undefined && body.url !== undefined) {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      comments: body.comments,
      user: user._id,
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } else {
    response.status(400).json(request.body);
  }
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).end();
    }
  },
);

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const savedBlog = await Blog.findByIdAndUpdate(request.params.id, body, {
    new: true,
  });
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
