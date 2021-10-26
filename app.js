const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const logger = require('morgan');

const app = express();

// importing index.js file form routes folder
const books = require('./routes/books');
const routes = require('./routes/index')

const {sequelize} = require('./models');


// view engine setup for pug;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// starting homepage
app.use('/', routes);
app.use('/books', books);

// asynchronously with database
(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();

// 404 error hander and rendering page not found
  app.use((req, res, next) => {
      console.log('404 Error hander called');
      const err = new Error("Looks like page you are searching does't exists.");
      res.status(404);
      res.render('page-not-found', {err})
  })

// global error hander with error page;
app.use((err, req, res, next) => {
    if(err.status === 404){
        res.redirect('page-not-found');
    }else{
        console.log('500 error hander called');
        err.status = 500;
        err.message = "Sorry! We couldn't find the page you were looking for.";
        res.status(err.status).render('error', {err});
    }
})

app.listen('3000', () => console.log('port 3000 is working'))

module.exports = app;