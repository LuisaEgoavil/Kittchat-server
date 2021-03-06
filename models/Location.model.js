const {Schema, model} = require("mongoose")

let LocationSchema = new Schema({
  cafeName: String,
  address: String,
  hours: String,
  phoneNumber: String,
  email: String,
  coordinates: String
})

let LocationModel = model('location', LocationSchema)

module.exports = LocationModel 