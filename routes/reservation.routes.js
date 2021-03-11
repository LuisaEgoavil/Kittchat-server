const express = require('express')
const LocationModel = require('../models/Location.model')
const router = express.Router()
const ReservationModel = require('../models/Reservation.model')

router.get('/profile' , (req, res) => {

  let userId = req.session.loggedInUser._id
  let admin = req.session.loggedInUser._id.admin

if(userId == admin) {
  ReservationModel.find()
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

  // check if the user is an admin
  // if admin. find ALL reservations and send them
  // if not admin. send onlz reservations from user. code below
  
    // ReservationModel.find({
    //   user: userId
    // })
    //   .populate("locationName")
    //   .then((reservations) => {
    //     console.log(reservations)
    //     res.status(200).json(reservations)
    //   })
    //   .catch((err) => {
    //     res.status(500).json({
    //       error: 'Something went wrong',
    //       message: err
    //     })
    //   }) 



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

router.patch('/profile/:id', (req, res) => {
  let id = req.params.id
  const{ reservationName, description} = req.body  //locationName, time, date,
  ReservationModel.findByIdAndUpdate(id, {$set: { reservationName, description}}) //locationName:locationName, time:time, date:date,
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