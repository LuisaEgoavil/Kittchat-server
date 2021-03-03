const {Schema, model} = require("mongoose");

let ReservationSchema = new Schema ({
  locationName: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  description: String
})

let ReservationModel = model('reservation', ReservationSchema)

module.exports = ReservationModel