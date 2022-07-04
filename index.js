const express = require("express");
const hbs = require("hbs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { body, validationResult } = require("express-validator");
const methodOverride = require("method-override");

require("./utils/db");
const contact = require("./models/contacts");

const app = express();
const port = 3000;

app.use(methodOverride("_method"));

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + "/views/templates");
hbs.registerHelper("inc", (value) => value + 1);
hbs.registerHelper("alert", (value) => (value == "success" ? true : false));
hbs.registerHelper("old", (value) => value.oldNama || value.nama);

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

app.get("/add", (req, res) => {
  res.render("add-contact", {
    title: "Add Contact",
    errors: req.flash("errors"),
  });
});

app.post(
  "/add",
  [
    body("nama").custom(async (value) => {
      const duplicate = await contact.findOne({ nama: value });
      if (duplicate) throw new Error("Nama sudah digunakan!");
      return true;
    }),
    body("email", "Email tidak valid").isEmail(),
    body("nohp", "Nomor HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      res.redirect("/add");
    } else {
      contact.insertMany(req.body, (err, result) => {
        req.flash("msg", "Kontak berhasil ditambah!");
        res.redirect("/");
      });
    }
  }
);

app.delete("/delete", (req, res) => {
  contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash("msg", "Data berhasil dihapus");
    res.redirect("/");
  });
});

app.get("/edit/:nama", async (req, res) => {
  const data = await contact.findOne({ nama: req.params.nama });

  res.render("edit-contact", {
    title: "Edit Contact",
    contact: data,
    errors: req.flash("errors"),
  });
});

app.put(
  "/edit",
  [
    body("nama").custom(async (value, { req }) => {
      const duplicate = await contact.findOne({ nama: value });
      if (value !== req.body.oldNama && duplicate)
        throw new Error("Nama sudah digunakan!");
      return true;
    }),
    body("email", "Email tidak valid").isEmail(),
    body("nohp", "Nomor HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      res.redirect("/edit/" + req.body.oldNama);
    } else {
      contact
        .updateOne(
          { _id: req.body._id },
          {
            $set: {
              nama: req.body.nama,
              email: req.body.email,
              nohp: req.body.nohp,
            },
          }
        )
        .then((result) => {
          req.flash("msg", "Kontak berhasil diubah!");
          res.redirect("/");
        });
    }
  }
);

app.get("/:nama", async (req, res) => {
  try {
    const data = await contact.findOne({ nama: req.params.nama });
    res.render("detail", {
      title: `Detail ${data.nama}`,
      contact: data,
    });
  } catch (err) {
    res.status(404).render("errors/404");
  }
});

app.use("/", (req, res) => {
  res.status(404);
  res.header("Content-Type", "text/html");
  res.render("errors/404");
});

app.listen(port, () => {
  console.log(`Mongo Contact App | Running on port ${port}`);
});
