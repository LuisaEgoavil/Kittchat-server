const express = require('express')
const router = express.Router()
const LocationModel = require("../models/Location.model.js")


//---------- Get route that will list all ou the locations----------//
router.get("/contact", (req, res, next) => {
  LocationModel.find()
  .then((location) => res.status(200).json(user))
  .catch((err) => console.log(err));
});








module.exports = router;