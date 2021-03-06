const express = require('express')
const LocationModel = require('../models/Location.model')
const router = express.Router()
const ReservationModel = require('../models/Reservation.model')

router.get('/profile' , (req, res) => {

  let userId = req.session.loggedInUser._id
  let adminId = req.session.loggedInUser.admin

  if(adminId) {
    ReservationModel.find()
    .populate("locationName")
    .populate("user")
    .then((reservations) => {
      console.log(reservations)
      // as good practices you should remove the passwordHash from the user before sending it. This is done with a map/forEach
      res.status(200).json(reservations)
    })
    .catch((err) => {
      res.status(500).json({
          error: 'Something went wrong',
          message: err
      })
    })

  } else {
    ReservationModel.find({
      user: userId
    })
      .populate("locationName")
      .then((reservations) => {
        console.log(reservations)
        res.status(200).json(reservations)
      })
      .catch((err) => {
        res.status(500).json({
        error: 'Something went wrong',
        message: err
        })
      }) 
  }
})

router.post('/booking', (req, res) => {
  const {locationName, time, date, reservationName, description} = req.body;
  console.log(req.body)

  //to check that all of the fields are complete
  if(!locationName || !time || !date || !reservationName) {
    console.log('something here')

    return res.status(400).json({
      message: 'Location, name, time & date are required!'
    })
  }
  
  let userId = req.session.loggedInUser._id

  LocationModel.find({cafeName: locationName})
    .then((response) => {
      console.log(response)
      // response will hold the location object with the id
        let locationId = response[0]._id

        ReservationModel.create({
          locationName: locationId, 
          time: time,
          date: date,
          reservationName: reservationName,
          description: description,
          user: userId,
      
        })
        .then((response) => {
          console.log(response, "checking here")
          res.status(200).json(response)
        })
        .catch((err) => {
          console.log(err)
          res.status(500).json({
            error: 'Something went wrong',
            message: err
          })
        })
    })
})

router.get('/booking/:id', (req, res) => {
  ReservationModel.findById(req.params.id)
    .populate("locationName")
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

router.patch('/reservation/:id/edit', (req, res) => {
  let id = req.params.id
  console.log(id)
  const{ date, time, reservationName, description} = req.body
  ReservationModel.findByIdAndUpdate(id, {$set: { time, date, reservationName, description}})
    .populate("locationName")  
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