const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb+srv://cs260:cs260@cluster0.kynusyc.mongodb.net/?retryWrites=true&w=majority', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});


const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  tmp: String,
});


const favoritesSchema = new mongoose.Schema({
  name: String,
  author: String,
  review: String,
});

const bookmarkSchema = new mongoose.Schema({
  name: String,
  author: String,
  pagenumber: Number,
  tmp: String,
});

bookSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
favoritesSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
bookmarkSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
});
  
bookSchema.set('toJSON', {
  virtuals: true
});

favoritesSchema.set('toJSON', {
  virtuals: true
});

bookmarkSchema.set('toJSON', {
  virtuals: true
});

//*********************** BOOKS IN DB ****************************
const Book = mongoose.model('Book', bookSchema);

app.get('/api/books', async (req, res) => {
  try {
    let books = await Book.find();
    res.send({books: books});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/books', async (req, res) => {
    const book = new Book({
    name: req.body.name,
    author: req.body.author,
    tmp: ""
  });
  try {
    await book.save();
    res.send({book:book});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    await Book.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//****************** FAVORITES IN DB ************************
const Favorite = mongoose.model('Favorite', favoritesSchema);

app.get('/api/favorites', async (req, res) => {
  try {
    let favorites = await Favorite.find();
    res.send({favorites: favorites});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/favorites', async (req, res) => {
    const favorite = new Favorite({
    name: req.body.name,
    author: req.body.author,
    review: req.body.review
  });
  try {
    await favorite.save();
    res.send({favorite:favorite});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/favorites', async (req, res) => {
  try {
    let addedvalue = req.body.review;
    await Favorite.findByIdAndUpdate(req.body.id, {review : addedvalue});
    res.sendStatus(200)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/favorites/:id', async (req, res) => {
  try {
    await Favorite.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//**************** BOOKMARKS IN DB ******************
const BookMark = mongoose.model('BookMark', bookmarkSchema);

app.get('/api/bookmarks', async (req, res) => {
  try {
    let bookmarks = await BookMark.find();
    res.send({bookmarks: bookmarks});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/bookmarks', async (req, res) => {
    const bookmarks = new BookMark({
    name: req.body.name,
    author: req.body.author,
    pagenumber: req.body.pagenumber,
    tmp: ""
  });
  try {
    await bookmarks.save();
    res.send({bookmarks:bookmarks});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/bookmarks', async (req, res) => {
  try {
    let pagenum = req.body.tmp
    await BookMark.findByIdAndUpdate(req.body.id, {pagenumber : pagenum});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/bookmarks/:id', async (req, res) => {
  try {
    await BookMark.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));