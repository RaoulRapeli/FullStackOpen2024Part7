const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const api = supertest(app);

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "rapeliRaoul",
      name: "Raoul Rapeli",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("expected `username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

describe("tests for blogs", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    const initialBlogs = helper.initialBlogs;
    const users = await helper.usersInDb();
    const user = users[0];
    initialBlogs.map((blog) => (blog["user"] = user.id));
    await Blog.insertMany(initialBlogs);
  });

  test("test there is 2 blogs", async () => {
    const userInfo = { username: "root", password: "sekret" };
    const user = await api.post("/api/login").send(userInfo);
    const blogs = await api
      .get("/api/blogs")
      .set("authorization", `Bearer ${user._body.token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(blogs.body).toHaveLength(2);
  });

  test("test blog ids", async () => {
    const userInfo = { username: "root", password: "sekret" };
    const user = await api.post("/api/login").send(userInfo);
    const blogs = await api
      .get("/api/blogs")
      .set("authorization", `Bearer ${user._body.token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    blogs.body.map((blog) => {
      expect(blog["id"]).toBeDefined();
    });
  });

  test("test adding valid blog", async () => {
    const userInfo = { username: "root", password: "sekret" };
    const user = await api.post("/api/login").send(userInfo);

    const newBlog = {
      title: "Testing",
      author: "Raoul Rapeli",
      url: "www.google.com",
      likes: 7,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("authorization", `Bearer ${user._body.token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((n) => n.title);
    expect(contents).toContain("Testing");
  });

  test("test adding blog without likes", async () => {
    const userInfo = { username: "root", password: "sekret" };
    const user = await api.post("/api/login").send(userInfo);
    const newBlog = {
      title: "Testing",
      author: "Raoul Rapeli",
      url: "www.google.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("authorization", `Bearer ${user._body.token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    blogsAtEnd.map((n) => {
      expect(n.likes).toBeGreaterThanOrEqual(0);
    });
  });

  test("test adding blog without title and url", async () => {
    const userInfo = { username: "root", password: "sekret" };
    const user = await api.post("/api/login").send(userInfo);
    const newBlogs = [
      {
        author: "Raoul Rapeli",
        url: "www.google.com",
        likes: 45,
      },
      {
        title: "Testing4",
        author: "Raoul Rapeli",
        likes: 4,
      },
      {
        author: "Raoul Rapeli",
        likes: 7,
      },
    ];

    await api
      .post("/api/blogs")
      .send(newBlogs[0])
      .set("authorization", `Bearer ${user._body.token}`)
      .expect(400);

    await api
      .post("/api/blogs")
      .send(newBlogs[1])
      .set("authorization", `Bearer ${user._body.token}`)
      .expect(400);

    await api
      .post("/api/blogs")
      .send(newBlogs[2])
      .set("authorization", `Bearer ${user._body.token}`)
      .expect(400);
  });

  test("delete blog", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    const userInfo = { username: "root", password: "sekret" };
    const user = await api.post("/api/login").send(userInfo);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("authorization", `Bearer ${user._body.token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const contents = blogsAtEnd.map((r) => r.title);
    expect(contents).not.toContain(blogToDelete.title);
  });

  test("update blog likes", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToAlter = blogsAtStart[0];
    const userInfo = { username: "root", password: "sekret" };
    const user = await api.post("/api/login").send(userInfo);
    blogToAlter.likes = 100;
    await api
      .put(`/api/blogs/${blogToAlter.id}`)
      .send(blogToAlter)
      .set("authorization", `Bearer ${user._body.token}`)
      .expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToAlter.id);
    expect(updatedBlog.likes).toEqual(100);
  });
  test("test adding blog without token", async () => {
    const newBlog = {
      title: "Testing",
      author: "Raoul Rapeli",
      url: "www.google.com",
      likes: 7,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
