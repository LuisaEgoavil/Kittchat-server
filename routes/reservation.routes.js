const express = require('express')
const router = express.Router()
const ReservationModel = require('../models/Reservation.model')

router.get('/reservation' , (req, res) => {
  ReservationModel.find()
    .then((reservation) => {
      res.status(200).json(reservation)
    })
    .catch(() => {
      res.status(500).json({
        error: 'Something went wrong',
        message: err
      })
    })
})

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

router.get('/reservation/reservationId', (req, res) => {
  ReservationModel.findById(req.params.reservationId)
    .then((response) => {
        res.status(200).json(response)
    })
    .catch((err) => {
        res.status(500).json({
          error:'Something went wrong',
          message: err
        })
    })
})

router.patch('/reservation/:id', (req, res) => {
  let id = req.params.id
  const{username, time, date, description} = req.body
  ReservationModel.findByIdAndUpdtate(id, {$set: {usernama: username, time:time, date: date, description: description}})
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