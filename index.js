const express = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/api/tags", (req, res) => {
  tags = require("./data/tags.js");
  res.json(tags);
});

app.get("/api/places", (req, res) => {
  places = require("./data/places.json");
  res.json(places);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
