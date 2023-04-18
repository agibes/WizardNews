const postBank = require("./postBank");
const morgan = require("morgan");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  const posts = postBank.list();
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`
  res.send(html);
});

app.use(express.static('public'));

app.get( '/posts/:id', (req, res, next) => {
  try {

    const id = req.params.id;
    const post = postBank.find(id);
    
    if (!post.id) {
      next({
        name: "Page Not Found",
        message: "Sorry, the page you are looking for could not be found.",
        status: 404
      })
    } else {
      const html = `
      <!DOCTYPE html>
      <html>
      <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
      <div class="news-list">
      <header><img src="/logo.png"/>Wizard News
      <small><a href="/" style="color:white; text-decoration:underline">Go Back</a></small>
      </header>
      <div class='news-item'>
      <p>
      ${post.title}
      <small>(by ${post.name})</small>
      </p>
      <p>${post.content}</p>  
      </div>
      </div>
      </body>
      </html>
      `
      res.send(html);
    }
  } catch (error) {
    next(error)
  }
  });
  
  
  
  app.use((err, req, res, next) => {
    console.log(err);
    if (err.status == 404) {

      res.status(404);
      const html = `
      <!DOCTYPE html>
      <html>
      <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
      <header><img src="/logo.png"/>Wizard News
      <small><a href="/" style="color:white; text-decoration:underline">Go Back</a></small>
      </header>
      <div class="not-found">
      <p>${err.status}: ${err.message}</p>
      </div>
      </body>
      </html>`
      res.send(html);
    }
    })
    
    
    
    
app.use(morgan('dev'));



const {PORT = 1337} = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
