const express = require('express')
const router = express.Router()

//INSTALL BCRYPT.JS
var bcrypt = require('bcryptjs');

//MODEL GOES HERE
const UserModel = require('../models/User.model');



//-------------------------------------------------------

router.post('/signup', (req, res) => {
  console.log(req.body)
  const {username, email, password} = req.body;

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
    console.log('correct')
    UserModel.create({username: username, email, passwordHash: hash})
      .then((user) => {
        // ensuring that we don't share the hash as well with the user
        
        user.passwordHash = "***";
        req.session.loggedInUser = user;
        res.status(200).json(user);
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(500).json({
            errorMessage: 'Username or email entered already exists!',
            message: err,
          });
        } 
        else {
          res.status(500).json({
            errorMessage: 'Something went wrong! ❌',
            message: err,
          });
        }
      })    
});

//-------------------------------------------------------
//LOGIN
router.post('/login', (req,res) => {
  const {email, password} = req.body;
console.log(password, email)
  if(!email || !password){
    res.status(500).json({
      error:'Please enter your email 📧 and password 🔑'
    })
    return;
  }
  // const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
  //   if (!myRegex.test(email)) {
  //       res.status(500).json({
  //           error: 'Email format not correct 😟',
  //       })
  //       return;  
  // }

//------------------------CHECKING LOGIN-------------------------------

    UserModel.findOne({email: email})
    .then((userData) => {
      console.log(userData)
      bcrypt.compare(password, userData.passwordHash)
            .then((doesItMatch) => {
              console.log(doesItMatch)
                //if it matches
                if (doesItMatch) {
                  // req.session is the special object that is available to you
                  userData.passwordHash = "***";
                  console.log(res.session)
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
        error: 'This email does not exist 😟',
        message: err
      })
      return;
    })
})

//-------------------------------------------------------

router.post('/logout', (req, res,next) => {
  if(req.session){
    req.session.destroy();
    res.status(204).json({});
  } else {
    next()
  }
  
})
//-------------------------------------------------------

const isLoggedIn = (req, res, next) => {
  if(req.session.loggedInUser){
    next()
  } 
  else {
    res.status(401).json({
      message: 'Unauthorized user 🚫',
      code: 401,
    })
  }
}

router.get('/user', isLoggedIn, (req,res) => {
  res.status(200).json(req.session.loggedInUser)
})

module.exports = router;

