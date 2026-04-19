const express = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/submit", (req, res) => {
  res.render("submit.ejs");
})

app.get("/api/tags", (req, res) => {
  tags = require("./data/tags.js");
  res.json(tags);
});

app.get("/api/places", (req, res) => {
  places = require("./data/places.json");
  res.json(places);
});

// Route for submitting data to the sqlite database, currently a placeholder
app.post("/api/submit", (req, res) => {
  res.json({ success: true, id: "placeholder" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
