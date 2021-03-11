const express = require('express')
const LocationModel = require('../models/Location.model')
const router = express.Router()
const ReservationModel = require('../models/Reservation.model')

router.get('/profile' , (req, res) => {
  // check if the user is an admin
  // if admin. find ALL reservations and send them
  // if not admin. send onlz reservations from user. code below

  let userId = req.session.loggedInUser._id
  let admin = req.session.loggedInUser.admin

  // does the user have a isOwner: true attribute?. You can check this in req.session.loggedInUser
  if(admin) {
    ReservationModel.find()
    .populate("locationName")
    .then((reservations) => {
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
  
  console.log(req.session)
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