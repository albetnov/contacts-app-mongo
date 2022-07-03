const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/contact_app");

// const contact1 = new Contact({
//     nama: "Asep Surasep",
//     nohp: "082938493",
//     email: "asep@mail.com",
//   });

//   // Simpan ke collection
//   contact1.save().then((contact) => console.log(contact));
