const express = require("express");
const hbs = require("hbs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db");
const contact = require("./models/contacts");

const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/templates");
hbs.registerHelper("inc", (value) => value + 1);
hbs.registerHelper("alert", (value) => (value == "success" ? true : false));

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", async (req, res) => {
  const contacts = await contact.find();

  res.render("home", {
    title: "Home",
    contacts,
    msg: req.flash("msg"),
  });
});

app.get("/:nama", async (req, res) => {
  const data = await contact.findOne({ nama: req.params.nama });
  res.render("detail", {
    title: `Detail ${data.nama}`,
    contact: data,
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.header("Content-Type", "text/html");
  res.render("errors/404");
});

app.listen(port, () => {
  console.log(`Mongo Contact App | Running on port ${port}`);
});
