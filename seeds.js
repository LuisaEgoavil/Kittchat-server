const mongoose = require("mongoose");
require("./db/index.js");
const LocationModel = require("./models/Location.model.js")

// locations to be added
let locations = [
  { cafeName: "location1", address: "Germany", hours: "11:00-18:00", phoneNumber: 1111111, email: "aaa@aaa.com"},
  { cafeName: "location2", address: "Spain", hours: "11:00-19:00", phoneNumber: 2222222, email: "bbb@aaa.com"},
  { cafeName: "location3", address: "England", hours: "11:00-20:00", phoneNumber: 3333333, email: "ccc@aaa.com"},
  { cafeName: "location4", address: "Finland", hours: "11:00-21:00", phoneNumber: 4444444, email: "ddd@aaa.com"},
  { cafeName: "location5", address: "France", hours: "11:00-22:00", phoneNumber: 5555555, email: "eee@aaa.com"}
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
