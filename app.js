//require modules
const express = require("express");
const app = express();
const db = require("./queries");
//express.json() middleware - enforce json request
app.use((req, res, next) => {
  express.json()(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: "Invalid JSON payload passed.",
        status: "error",
        data: null,
      });
    }
    next();
  });
});

//ROUTES

// - GET ROUTE
app.get("/:param", db.salesStats);

// - POST ROUTE
app.post("/", db.addSalesInfo);

//port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running @ PORT ${PORT}`));
