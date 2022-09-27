/** Server startup for BizTime. */
const db = require('./db.js');
const companyRoutes = require('./routes/companies.js')


const app = require("./app");


app.listen(3000, function () {
  console.log("Listening on 3000");
});