const {Schema, model} = require("mongoose");

let ReservationSchema = new Schema ({
  locationName: {
    type: Schema.Types.ObjectId, ref: "location",
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
  user: {
    type: Schema.Types.ObjectId, ref: "user"
  },

  reservationName: String,

  description: String,
})

let ReservationModel = model('reservation', ReservationSchema)

module.exports = ReservationModel