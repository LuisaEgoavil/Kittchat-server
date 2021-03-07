const {Schema, model} = require("mongoose");

let ReservationSchema = new Schema ({
  locationName: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },

  reservationName: String,

  description: String,
})

let ReservationModel = model('reservation', ReservationSchema)

module.exports = ReservationModel