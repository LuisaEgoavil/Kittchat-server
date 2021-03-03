const {Schema, model} = require("mongoose")

let LocationSchema = new Schema({
  coordinates: String
})

let LocationModel = model('location', LocationSchema)

module.exports = LocationModel 