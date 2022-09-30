/** Server startup for BizTime. */
const db = require('./db.js');
const app = require("./app");
// const companyRoutes = require('./routes/companies.js');
// const invoiceRoutes = require('./routes/invoices.js');






app.listen(3000, function () {
  console.log("Listening on 3000");
});