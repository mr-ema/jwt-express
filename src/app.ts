import express, { Express, NextFunction, Request, Response } from 'express';
const path = require('path');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Configuration
require('dotenv').config();
require('./config/database').connectDB();

const app: Express = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static( path.join(path.dirname(__dirname), '/public') ));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

// Routes
const indexRouter = require('./routes/index');
const registerRouter = require('./routes/signIn');
const loginRouter = require('./routes/login');

// Router
app.use('/', indexRouter);
app.use('/signin', registerRouter);
app.use('/login', loginRouter);


// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

interface HttpError extends NodeJS.ErrnoException  {
  status: number
}
// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;