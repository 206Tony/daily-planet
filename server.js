const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
const fs = require('fs');
const methodOverride = require('method-override');
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.get('/', function(req, res) {
  res.send('index');
});

app.get("/articles", function(req, res) {
  var articles = fs.readFileSync("./articles.json");
  var articleData = JSON.parse(articles);
  console.log(articleData);
  res.render('articles/index', {articles: articleData});
});

app.get("/articles/new", function(req, res) {
  res.render('articles/new');
});

app.get('/articles/:id/edit', function(req, res) {
  var articles = fs.readFileSync('./articles.json');
  var articleData = JSON.parse(articles);
  var id = parseInt(req.params.id);
  res.render('articles/edit', {article: articleData[id], id})
})

app.get("/articles/:id", function(req, res) {
  var articles = fs.readFileSync('./articles.json');
  var articleData = JSON.parse(articles);
  var id = parseInt(req.params.id);
  res.render('articles/show', {article: articleData[id], id});
});

app.post("/articles", function(req, res) {
  var articles = fs.readFileSync("./articles.json");
  var articleData = JSON.parse(articles);
  var newArticleData = {
    title: req.body.articleTitle,
    body: req.body.articleBody
  }
  articleData.push(newArticleData);
  fs.writeFileSync('./articles.json', JSON.stringify(articleData));

  res.redirect('/articles');
})

app.delete('/articles/:id', function(req, res) {
  var articles = fs.readFileSync('./articles.json');
  var articleData = JSON.parse(articles);
  var id = parseInt(req.params.id);
  articleData.splice(id, 1);
  var articleString = JSON.stringify(articleData);
  fs.writeFileSync('./articles.json', articleString)

  res.redirect('/articles');
})

app.put('/articles/:id', function(req, res) {
  var articles = fs.readFileSync('./articles.json');
  var articleData = JSON.parse(articles);
  var id = parseInt(req.params.id);
  articleData[id].title = req.body.articleTitle;
  articleData[id].body = req.body.articleBody;
  fs.writeFileSync('./articles.json', JSON.stringify(articleData));
  res.redirect('/articles/' + id);;
})

app.listen( PORT || 3000 );


