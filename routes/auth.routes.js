const express = require('express')
const router = express.Router()

//INSTALL BCRYPT.JS
var bcrypt = require('bcryptjs');

//MODEL GOES HERE
const UserModel = require('../models/User.model');
const { response } = require('express');


//-------------------------------------------------------

router.post('/signup', (req, res) => {
  const {username, email, password} = req,body;

  if(!username ||  !email || !password){
    res.status(500)
      .json({
        errorMessage: 'Please enter all fields 👀'
      });
    return;
  }
  const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!myRegex.test(email)) {
        res.status(500).json({
          errorMessage: 'Email format not correct'
        });
        return;  
    }
    const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
    if (!myPassRegex.test(password)) {
      res.status(500).json({
        errorMessage: 'Password needs to have 8 characters, a number and an Uppercase alphabet '
      });
      return;  
    }

    //CREATING A SALT
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    UserModel.create({name: username, email, passwordHash: hash})
      .then((user) => {
        // ensuring that we don't share the hash as well with the user
        user.passwordHash = "***";
        res.status(200).json(user);
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(500).json({
            errorMessage: 'username or email entered already exists!',
            message: err,
          });
        } 
        else {
          res.status(500).json({
            errorMessage: 'Something went wrong! Go to sleep!',
            message: err,
          });
        }
      })    
});

//-------------------------------------------------------
//LOGIN
router.post('/login', (req,res) => {
  const {email, password} = req.body;

  if(!email || !password){
    res.status(500).json({
      error:'Please enter your email 📧 and password 🔑'
    })
    return;
  }
  const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!myRegex.test(email)) {
        res.status(500).json({
            error: 'Email format not correct 😟',
        })
        return;  
    }

//-------------------------------------------------------

    UserModel.findOne({email})
    .then((userData) => {
      bcrypt.compare(password, userData.passwordHash)
            .then((doesItMatch) => {
                //if it matches
                if (doesItMatch) {
                  // req.session is the special object that is available to you
                  userData.passwordHash = "***";
                  req.session.loggedInUser = userData;
                  res.status(200).json(userData)
                }
                //if passwords do not match
                else {
                    res.status(500).json({
                        error: 'Incorrect password 🤔',
                    })
                  return; 
                }
            })
            .catch(() => {
              res.status(500).json({
                error: 'Email format not correct 😐',
              })
              return; 
            });
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Email does not exist 😟',
        message: err
      })
      return;
    })
})

//-------------------------------------------------------

router.post('/logout', (req, res, next) => {
  if(req.session.loggedInUser){
    next()
  }
  else{
    res.status(401).json({
      message: 'Unauthorized user 🚫'
    })
  }
})

router.get('/user', isLoggedIn, (req, res, next) => {
  res.status(200).json(req.session.loggedInUser)
})

module.exports = router;

