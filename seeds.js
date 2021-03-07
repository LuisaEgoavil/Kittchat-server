const mongoose = require("mongoose");
require("./db/index.js");
const LocationModel = require("./models/Location.model.js")

// locations to be added
let locations = [
  { 
    cafeName: "Kittchat Schöneberg", 
    address: "Manteuffelstraße 20, 12103 Berlin", 
    hours: "11:00-19:00", 
    phoneNumber: "0176 95853433", 
    email: "kittchatcafe@gmail.com"
  },
  { cafeName: "Kittchat Charlottenburg", 
    address: "Otto-Suhr-Allee 12, 10585 Berlin", 
    hours: "11:30-19:00", 
    phoneNumber: "0561 95015988", 
    email: "kittchatcafe@gmail.com"
  },
  { cafeName: "Kittchat Kreuzberg", 
    address: "Paul-Lincke-Ufer 25A, 10999 Berlin", 
    hours: "11:00-20:00", 
    phoneNumber: "0515 98952555", 
    email: "kittchatcafe@gmail.com"
  },
  { cafeName: "Kittchat Neukölln", 
    address: "Leykestraße 8A, 12053 Berlin", 
    hours: "12:00-19:30", 
    phoneNumber: "0176 91442255", 
    email: "kittchatcafe@gmail.com"
  },
  { cafeName: "Kittchat Prenzlauer Berg", 
    address: "Marienburger Straße 27, 10405 Berlin", 
    hours: "11:00-20:00", 
    phoneNumber: "0159 62582122", 
    email: "kittchatcafe@gmail.com"
  }
]

//to add an array of several elemnts to DB
LocationModel.insertMany(locations)
  .then((addedLocations) => {
    addedLocations.forEach(eachLocations => console.log(eachLocations.name))
    
    //to close the DB after data insertion
    mongoose.connection.close()
    .then(() => console.log("database closed"))
    .catch((err) => console.log("Error closing DB", err))
  })
  .catch((err) => {
    console.log("Error with mongoose method", err)
  })
