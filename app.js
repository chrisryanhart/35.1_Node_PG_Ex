/** BizTime express application. */

const db = require('./db.js');

const express = require("express");

const app = express();
const ExpressError = require("./expressError.js")
const companies = require('./routes/companies.js')

app.use(express.json());
// app.use(u)

app.use('/companies',companies);


/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});


// app.get('/',function(req,res){

//   return res.send({"msg": "This is a test"});
// })

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;