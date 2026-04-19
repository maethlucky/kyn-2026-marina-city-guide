const express = require("express");
const fs = require("fs")
const db = require("./db.js")


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

  const submitted = db.prepare(`
    SELECT id, name, lat, lon, phone, website, hours, tags
    FROM user_submissions
  `).all().map((row) => ({
    id: `user-${row.id}`,
    name: row.name,
    lat: row.lat,
    lon: row.lon,
    phone: row.phone,
    website: row.website,
    hours: row.hours,
    tags: JSON.parse(row.tags)
  }));


  res.json([...places,...submitted]);
});

// Route for submitting data to the sqlite database, currently a placeholder
app.post("/api/submit", (req, res) => {
  const { name, lat, lon, phone, website, hours, tags } = req.body;
  if (!name || typeof lat !== "number" || typeof lon !== "number") {
    return res.status(400).json({ success: false, error: "Missing required fields." });
  }
  const stmt = db.prepare(`
    INSERT INTO user_submissions (name, lat, lon, phone, website, hours, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name,
    lat,
    lon,
    phone || null,
    website || null,
    hours || null,
    JSON.stringify(tags || [])
  );
  res.json({ success: true, id: result.lastInsertRowid  });
});



app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
