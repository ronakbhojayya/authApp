const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const MongoUri =
  "mongodb+srv://ronak:Ronak123@registrationdb.e2xn7zs.mongodb.net/?retryWrites=true&w=majority&appName=registrationdb";

const connectMongoDbSession = require("connect-mongodb-session");
const MongoDbSession = connectMongoDbSession(session);

const path = require("path");
const User = require("./models/user");

const bcrypt = require("bcryptjs");

//database connection

mongoose
  .connect(MongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb Connected");
  })
  .catch(() => {
    console.log("Mongodb connection error");
  });
//session storing

const store = new MongoDbSession({
  uri: MongoUri,
  collection: "mySessions",
});

//middelwares

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/login");
  }
};

//----------------------------------------------------------------------------

//routes
app.get("/", (req, res) => {
  res.render("landingPage", { title: "Landing Page" });
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Sign Up" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Sign In" });
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.redirect("/register");
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });

  if (!user) {
    res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.redirect("/login");
  }
  req.session.isAuth = true;
  res.redirect("/dashboard");
});

app.get("/dashboard", isAuth, (req, res) => {
  const { username } = req.body;
  res.render("dashboard");
  console.log(username);
});
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
});

//----------------------------------------------------------------------------

//starting server
app.listen(3000, () => {
  console.log("server running on port: 3000");
});
