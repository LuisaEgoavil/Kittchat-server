const express = require('express')
const LocationModel = require('../models/Location.model')
const router = express.Router()
const ReservationModel = require('../models/Reservation.model')

router.get('/profile' , (req, res) => {

  let userId = req.session.loggedInUser._id

  ReservationModel.find({
    user: userId
  })
    .populate("locationName")
    .then((reservations) => {
      console.log(reservations)
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
  
  console.log(req.session)
  let userId = req.session.loggedInUser._id

  // here we will find the id of the location by its name
  // I have the location name
  // how can I look in the location collection to see their ids?
  // we need to access the DB to get location id



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


  // let locationDetails = req.session.
  // console.log(rew.session.location)

  
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