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
const flush = require("connect-flash");

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
    cookie: { maxAge: 600000 },
    saveUninitialized: false,
    store: store,
  })
);

app.use(flush());

//isAuth middleware
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
  console.log(req.query.isOut);
  res.render("landingPage", {  msg: req.query.isOut, title: "Home Page" });
});

app.get("/register", (req, res) => {
  res.render("register", { msg: req.flash("msg"), title: "Sign Up" });
});

app.get("/login", (req, res) => {
  res.render("login", { msg: req.flash("msg"), title: "Sign In" });
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    req.flash("msg", "Already existing email");
    return res.redirect("/register");
  }
  user = await User.findOne({ username });
  if (user) {
    req.flash("msg", "Already existing username");
    return res.redirect("/register");
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    req.flash("msg", "User account created");
    res.redirect("/login");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let user = await User.findOne({ username });

  if (!user) {
    req.flash("msg", "incorrect username");
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    req.flash("msg", "incorrect password");
    return res.redirect("/login");
  }
  req.session.isAuth = true;
  const data = username;
  req.flash("msg", "Signed In");
  res.redirect(`/dashboard?user=${data}`);
});

app.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard", {
    msg: req.flash("msg"),
    username: req.query.user,
    title: "Welcome ",
  });
});
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw err;
    }
    
     isOut = 'Signed Out';
    res.redirect(`/?isOut=${isOut}`);
  });
});

//----------------------------------------------------------------------------

//starting server
app.listen(3000, () => {
  console.log("server running on port: 3000");
});
