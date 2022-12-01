import { useState, useEffect } from 'react';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import axios from 'axios';
import './App.css';


function App() {
  
  const [isVarChanged, setChanged] = useState(false);
  
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  
  const [error, setError] = useState("");
  
  const [count, setCount] = useState("")
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [newReview, setReview] = useState("")
  
  
  const fetchBooks = async() => {
    try {      
      const response = await axios.get("/api/books");
      setBooks(response.data.books);
    } catch(error) {
      setError("error retrieving books: " + error);
    }
  }
  const createBook = async() => {
    try {
      await axios.post("/api/books", {name: name, author: author, tmp: ""});
    } catch(error) {
      setError("error adding a book: " + error);
    }
  }
  const deleteOneBook = async(book) => {
    try {
      await axios.delete("/api/books/" + book.id);
    } catch(error) {
      setError("error deleting a book" + error);
    }
  }
  
  useEffect(() => {
    fetchBooks();
  },[]);

  const addBook = async(e) => {
    e.preventDefault();
    await createBook();
    fetchBooks();
    setName("");
    setAuthor("");
    setReview("");
    setCount("");
  }

  const deleteBook = async(book) => {
    await deleteOneBook(book);
    fetchBooks();
  }
  
  const fetchFavorites = async() => {
    try {      
      console.log("Calling Fetch Favorites");
      const response = await axios.get("/api/favorites");
      setFavorites(response.data.favorites);
    } catch(error) {
      setError("error retrieving favorites: " + error);
    }
  }
  const createFavorite = async(book) => {
    try {
      console.log(book);
      await axios.post("/api/favorites", {name: book.name, author: book.author, review: book.tmp});
    } catch(error) {
      setError("error adding a favorite: " + error);
    }
  }
  
  const updateReview = async(book) => {
    try {
      await axios.put("/api/favorites", {id: book.id, name: book.name, author: book.author, review: book.review});
      console.log("calling update Rev");
    } catch(error) {
      setError("error adding a favorite: " + error);
    }
  }
  
  const deleteOneFavorite = async(fave) => {
    try {
      await axios.delete("/api/favorites/" + fave.id);
    } catch(error) {
      setError("error deleting a favorite" + error);
    }
  }
  
  useEffect(() => {
    fetchFavorites();
    setChanged(false);
  },[isVarChanged]);

  const newRev = async(fave) => {
    await updateReview(fave.data);
    setChanged(true);
    fetchFavorites();
  }

  const addFave = async(e) => {
    await createFavorite(e);
    fetchFavorites();
    setName("");
    setAuthor("");
    setReview("");
    setCount("");
  }

  const deleteFave = async(fave) => {
    await deleteOneFavorite(fave);
    fetchFavorites();
  }
  
  const fetchBookmarks = async() => {
    try {      
      const response = await axios.get("/api/bookmarks");
      setBookmarks(response.data.bookmarks);
    } catch(error) {
      setError("error retrieving bookmarks: " + error);
    }
  }
  const createBookmark = async(book) => {
    try {
      let num = '0';
      if (book.pagenumber){
        num = book.pagenumber;
      }
      await axios.post("/api/bookmarks", {name: book.name, author: book.author, pagenumber: num, tmp: ""});
    } catch(error) {
      setError("error adding a bookmark: " + error);
    }
  }
  const deleteOneBookmark = async(bm) => {
    try {
      await axios.delete("/api/bookmarks/" + bm.id);
    } catch(error) {
      setError("error deleting a bookmark" + error);
    }
  }
  
  const updateBookPage = async(bm) => {
    try {
      
      await axios.put("/api/bookmarks", {id: bm.id, pagenum:bm.pagenumber});
    } catch(error) {
      setError("error deleting a bookmark" + error);
    }
  }
  
  useEffect(() => {
    fetchBookmarks();
  },[]);

  const addBm = async(e) => {
    await createBookmark(e);
    fetchBookmarks();
    setName("");
    setAuthor("");
    setReview("");
    setCount("");
  }

  const deleteBm = async(bm) => {
    await deleteOneBookmark(bm);
    fetchBookmarks();
  }
  
  const updatePageNum = async(bm) => {
    console.log(bm);
    await deleteOneBookmark(bm);
    await createBookmark({name: bm.name, author: bm.author, pagenumber: count});
    fetchBookmarks();
    setName("");
    setAuthor("");
    setReview("");
    setCount("");
  }
  
  
  return (
    <div className="App">
    
      <h1 id="PageTitle">My Book List</h1>
      
      <div className="colWrap">
      <div className="columnn">
      <h1>All Books</h1>
      <form onSubmit={addBook} className="form">
      <h2>Create a Book</h2>
        <div>
            <input placeholder="Title" type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
            <input placeholder="Author" type="text" value={author} onChange={e=>setAuthor(e.target.value)} />
        </div>
        <input type="submit" value="Submit" />
      </form>
      {books?.map( book => (
        <div key={book.id} className="book">
          <div className="bookDescription">
            <p><strong>{book.name}</strong></p>
            <p><i>By: {book.author}</i></p>
          </div>
            <button onClick={e => addFave(book)}>Add To Favorites</button><p></p>
          <button onClick={e => deleteBook(book)}>Delete</button>
          <button onClick={e => addBm(book)}>Start Reading</button>
        </div>
      ))}
      </div>
      
      <div className="columnn">
      <h1>Favorite Books</h1>
      {favorites?.map( fave => (
        <div key={fave.id} className="book">
          <div className="bookDescription">
            <p><strong>{fave.name}</strong></p>
            <p><i>By: {fave.author}</i></p>
            <p>My Rating: {fave.review}</p>
            Rate:
            <button onClick={e => newRev({data: {id: fave.id, name: fave.name, author: fave.author, review: "Bad"}, obj:fave})}>Bad</button>
            <button onClick={e => newRev({data: {id: fave.id, name: fave.name, author: fave.author, review: "Ok"}, obj:fave})}>Ok</button>
            <button onClick={e => newRev({data: {id: fave.id, name: fave.name, author: fave.author, review: "Good"}, obj:fave})}>Good</button>
            
          </div>
          <button onClick={e => deleteFave(fave)}>Remove From Favorites</button>
        </div>
      ))}
      </div>
      
      
      <div className="columnn">
      <h1>Currently Reading</h1>
      {bookmarks?.map( bm => (
        <div key={bm.id} className="book">
          <div className="bookDescription">
            <p><strong>{bm.name}</strong></p>
            <p><i>By: {bm.author}</i></p>
          </div>
          <button onClick={e => deleteBm(bm)}>Done Reading</button><p></p>
          <button onClick={e => addFave({name: bm.name, author: bm.author, review: ""})}>Add to Favorites</button>
        </div>
      ))}
      </div>
      </div>
      {error}
      <Router>
      <div>
        
        <a href="https://github.com/Maras59/creative-project-4" target="_blank" rel="noreferrer">
          <button>GitHub Repo</button>
        </a>
      </div>
    </Router>
    </div>
    
  );
}

export default App;
