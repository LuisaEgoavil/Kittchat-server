const express = require('express')
const router = express.Router()
const LocationModel = require("../models/Location.model.js")


//---------- Get route that will list all ou the locations----------//
router.get("/location", (req, res, next) => {
  LocationModel.find()
  .then((locations) => res.status(200).json(locations))
  .catch((err) => console.log(err));
});

module.exports = router;