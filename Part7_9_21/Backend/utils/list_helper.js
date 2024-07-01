const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const initialValue = 0;
  const amountOfLikes = blogs
    .map((b) => b.likes)
    .reduce((s, p) => s + p, initialValue);
  return amountOfLikes;
};

const favoriteBlog = (blogs) => {
  const blog = blogs.reduce(function (prev, current) {
    blogFormat = prev && prev.likes > current.likes ? prev : current;
    return {
      title: blogFormat.title,
      author: blogFormat.author,
      likes: blogFormat.likes,
    };
  });

  return blog;
};

const mostBlogs = (blogs) => {
  let blogers = [];
  blogs.map((blog) => {
    let findBloger = blogers.find((bloger) => bloger.author === blog.author);
    if (findBloger === undefined || findBloger === -1) {
      blogers.push({ author: blog.author, blogs: 1 });
    } else {
      let index = blogers.map((bloger) => bloger.author).indexOf(blog.author);
      blogers[index].blogs = blogers[index].blogs + 1;
    }
  });

  mostActiveBloger = blogers.reduce(function (prev, current) {
    return prev && prev.blogs > current.blogs ? prev : current;
  });

  return mostActiveBloger;
};

const mostLikes = (blogs) => {
  let blogers = [];
  blogs.map((blog) => {
    let findBloger = blogers.find((bloger) => bloger.author === blog.author);
    if (findBloger === undefined || findBloger === -1) {
      blogers.push({ author: blog.author, likes: blog.likes });
    } else {
      let index = blogers.map((bloger) => bloger.author).indexOf(blog.author);
      blogers[index].likes = blogers[index].likes + blog.likes;
    }
  });

  mostActiveBloger = blogers.reduce(function (prev, current) {
    return prev && prev.likes > current.likes ? prev : current;
  });

  return mostActiveBloger;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
