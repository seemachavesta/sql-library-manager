const express = require('express');
const router = express.Router();

const Book = require('../models').Book;


// async handler function to wrap all route
function asyncHandler(cb){
    return async(req, res, next) => {
        try {
            await cb(req, res, next);
        }catch(error){
            next(error);
        }
    }
}



// listing new book on home page
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render('index', {books, title: "SQL Library Manager"});
}))
    
// create new book   
router.get('/new', (req, res) => {
    res.render('new-book', {books: {}, title: "New Book"})
})

// post new book
router.post('/new', asyncHandler(async (req, res) => {
    let books;
    try{
        books = await Book.create(req.body);
        res.redirect('/');
    }catch(error){
        if(error.name === "SequelizeValidationError"){
            books = await Book.build(req.body);
            res.render("new-book", {books, errors: error.errors, title: "New Book"});
        }else{
            throw error;
        }
    }
      
  }));


  // Display book detail form 
  router.get('/:id', asyncHandler(async(req, res, next) => {
      const book = await Book.findByPk(req.params.id);
      if(book){
          res.render('update-book', {book: book})
      }else{
          next(err)
      }
  }))

  // post the updated book
router.post('/:id', asyncHandler(async(req, res) => {
    let book;
    try{
        book = await Book.findByPk(req.params.id);
        if(book){
            await book.update(req.body);
            res.redirect('/books');
        }else{
            req.sendStatus(404);
        }
    }catch(error){
        if(error.name === 'SequelizeValidationError'){
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render('update-book', {book, errors: error.errors, title: "Update Book"});
        }

    }
}))

// delete book form;

router.get("/:id/delete", asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book){
        res.render('books/delete', {book, title: "Delete Book"});
    }else{
        res.sendStatus(404);
    }
}))

// delete individul book;
router.post('/:id/delete', asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book){
        await book.destroy();
        res.redirect('/books');
    }else{
        res.sendStatus(404);
    }
}))












module.exports = router;