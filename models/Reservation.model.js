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
  description: String,

  myUserId: {
    type: Schema.Types.ObjectId, 
    ref: 'user'
  }
})

let ReservationModel = model('reservation', ReservationSchema)

module.exports = ReservationModel