require("dotenv").config();

console.log("CLIENT ID:", process.env.GITHUB_CLIENT_ID);
console.log("CLIENT SECRET exists:", !!process.env.GITHUB_CLIENT_SECRET);
console.log("SESSION SECRET exists:", !!process.env.SESSION_SECRET);


const express = require("express");
const fs = require("fs");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const db = require("./db.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: "/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value || null;

      const existingUser = db
        .prepare("SELECT * FROM users WHERE github_id = ?")
        .get(profile.id);

      if (existingUser) {
        return done(null, existingUser);
      }

      const result = db
        .prepare(`
          INSERT INTO users (github_id, username, display_name, email)
          VALUES (?, ?, ?, ?)
        `)
        .run(
          profile.id,
          profile.username,
          profile.displayName || profile.username,
          email
        );

      const user = db
        .prepare("SELECT * FROM users WHERE id = ?")
        .get(result.lastInsertRowid);

      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  done(null, user || false);
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/submit", (req, res) => {
  res.render("submit.ejs");
});

app.get("/api/tags", (req, res) => {
  const tags = require("./data/tags.js");
  res.json(tags);
});

app.get("/api/places", (req, res) => {
  const places = JSON.parse(fs.readFileSync("./data/places.json", "utf8"));

  const submitted = db
    .prepare(`
      SELECT id, name, lat, lon, phone, website, hours, tags
      FROM user_submissions
    `)
    .all()
    .map((row) => ({
      id: row.id + 100,
      name: row.name,
      lat: row.lat,
      lon: row.lon,
      phone: row.phone,
      website: row.website,
      hours: row.hours,
      tags: JSON.parse(row.tags),
    }));

  res.json([...places, ...submitted]);
});

app.post("/api/submit", (req, res) => {
  const { name, lat, lon, phone, website, hours, tags } = req.body;

  if (!name || typeof lat !== "number" || typeof lon !== "number") {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields." });
  }

  const result = db
    .prepare(`
      INSERT INTO user_submissions (name, lat, lon, phone, website, hours, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      name,
      lat,
      lon,
      phone || null,
      website || null,
      hours || null,
      JSON.stringify(tags || [])
    );

  res.json({ success: true, id: result.lastInsertRowid });
});

app.delete("/api/submissions", (req, res) => {
  const result = db.prepare("DELETE FROM user_submissions").run();
  res.json({ success: true, deleted: result.changes });
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});