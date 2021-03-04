const express = require('express')
const router = express.Router()
const ReservationModel = require('../models/Reservation.model')


router.post('/create', (req, res) => {
  const {username, time, date, description} = req.body;
  console.log(req.body)

  //to check that all of the fields are complete
  if(!username || !time || !date) {
    //is it 404 or 400?
    return res.status(400).json({
      message: 'Name, time & date are required! '
    })
  }

  ReservationModel.create({
    username: username,
    time: time,
    date: date,
    description: description
  })
  .then((response) => {
    res.status(200).json(response)
  })
  .catch((err) => {
    res.status(500).json({
      error: 'Something went wrong',
      message: err
    })
  })

})

//store the information in the DB


//USER

//DATE
//TIME
//DESCRIPTION


module.exports = router