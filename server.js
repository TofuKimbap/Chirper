const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");

const app = express();

// Import Routes
const users = require("./routes/api/users");

/*
 * Body Parser Middleware:
 * Makes request body available under the req.body property.
 */
// Parses only urlencoded bodies. (UTF-8)
// The req.body object contains values of type string or array.
app.use(bodyParser.urlencoded({ extended: false }));
// Parses only json.
app.use(bodyParser.json());

// Import connection string of MongoDB
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// API Routes
app.use("/api/users", users);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  // Catch all other routes besides the api routes.
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Use environment variable as port in production
const port = process.env.PORT || 6000;

app.listen(port, () => console.log(`Server listening on port ${port}!`));
