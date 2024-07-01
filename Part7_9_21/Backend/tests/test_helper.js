const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "Testing1",
    author: "Raoul Rapeli",
    url: "www.google.com",
    likes: 45,
  },
  {
    title: "Testing2",
    author: "Raoul Rapeli",
    url: "www.google.com",
    likes: 4,
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({ title: "Testing3" });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
