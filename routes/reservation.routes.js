const express = require('express')
const router = express.Router()
const ReservationModel = require('../models/Reservation.model')

router.get('/profile' , (req, res) => {

  
  ReservationModel.find()
    .then((reservations) => {
      res.status(200).json(reservations)
    })
    .catch(() => {
      res.status(500).json({
        error: 'Something went wrong',
        message: err
      })
    })
})

router.post('/booking', (req, res) => {
  const {locationName, time, date, reservationName, description} = req.body;
  //console.log(req.body)

  //to check that all of the fields are complete
  if(!locationName || !time || !date || !reservationName) {
    console.log('something here')

    return res.status(400).json({
      message: 'Location, name, time & date are required!'
    })
  }

  ReservationModel.create({
    locationName: locationName, 
    time: time,
    date: date,
    reservationName: reservationName,
    description: description,
    
  })
  .then((response) => {
    console.log(response, "checking here")
    res.status(200).json(response)
  })
  .catch((err) => {
    res.status(500).json({
      error: 'Something went wrong',
      message: err
    })
  })
})

router.get('/booking/:id', (req, res) => {
  ReservationModel.findById(req.params.id)
    .then((response) => {
      console.log(response)
        res.status(200).json(response)
    })
    .catch((err) => {
        res.status(500).json({
          error:'Something went wrong',
          message: err
        })
    })
})

router.delete('/bookinglist/:id', (req,res) => {
  ReservationModel.findByIdAndDelete(req.params.id)
    .then((response) => {
      res.status(200).json(response)
    })
    .catch((err) => {
      res.status(500).json({
        error: 'something went wrong',
        message: err
      })
    })
})



router.patch('/reservations/:id', (req, res) => {
  let id = req.params.id
  const{locationName, time, date, reservationName, description} = req.body
  ReservationModel.findByIdAndUpdtate(id, {$set: {locationName:locationName, time:time, date:date, reservationName:reservationName, description:description, completed: completed}})
      .then((response) => {
            res.status(200).json(response)
      })
      .catch((err) => {
            res.status(500).json({
              error: "something went wrong",
              message: err
            })
      })
})


module.exports = router