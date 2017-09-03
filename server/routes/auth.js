const express = require( 'express');
const jwt = require( 'jsonwebtoken');
const passport = require( 'passport');
const User = require( 'mongoose').model('User');

const router = new express.Router();

validateSignupForm = (payload) => {
  const errors = {};
  let is_valid = true;
  let message = "";
  // FIXME: validate email format, password length (and contents?)
  if( !payload || typeof payload.email !== "string"){
    console.log( "email type:", typeof payload.email);
    is_valid = false;
    errors.email = "Please provide a valid email";
  }
  if( !payload || typeof payload.password !== "string"){
    is_valid = false;
    errors.password = "Please provide a valid password";
  }
  if( !payload || typeof payload.name !== "string" || payload.name.trim().length === 0){
    is_valid = false;
    errors.name = "Please provide a valid name";
  }
  if( !is_valid) message = "Check the form for errors";
  return { success: is_valid, message, errors};
};

validateLoginForm = (payload) => {
    const errors = {};
    let is_valid = true;
    let message = "";
    // FIXME: validate email format, password length (and contents?)
    if( !payload || typeof payload.email !== "string"){
      is_valid = false;
      errors.email = "Please provide your email address";
    }
    if( !payload || typeof payload.password !== "string"){
      is_valid = false;
      errors.password = "Please provide your password";
    }
    if( !is_valid) message = "Check the form for errors";
    return { success: is_valid, message, errors};
};

validatePasswordForm = (payload) => {
    const errors = {};
    let is_valid = true;
    let message = "";
    // FIXME: validate email format, password length (and contents?)
    if( !payload || typeof payload.email !== "string"){
      is_valid = false;
      errors.email = "oops! We failed to find your account";
    }
    if( !payload || typeof payload.password !== "string"){
      is_valid = false;
      errors.password = "Please provide your password";
    }
    if( !payload || typeof payload.new_password !== "string"){
      is_valid = false;
      errors.new_password = "Please provide a new password";
    }
    if( !is_valid) message = "Check the form for errors";
    return { success: is_valid, message, errors};
};

router.post( '/signup', ( req, res, next) => {
  const valid = validateSignupForm( req.body);
  if( !valid.success){
    const { message, errors} = valid;
    return res.status( 400).json( { success: false, message, errors});
  }
  return passport.authenticate( 'local-signup', (err) => {
    if( err){
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Check the form for errors.',
          errors: {
            email: 'This email is already taken.'
          }
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }
    return res.status( 200)
      .json( { success:true, message:"Signup success, please login"});
  })(req,res,next);
});

router.post( '/login', ( req, res, next) => {
  const valid = validateLoginForm( req.body);
  if( !valid.success){
    const {errors, message} = valid;
    return res.status( 400).json( {success:false, errors, message});
  }
  return passport.authenticate( 'local-login', ( err, token, userData) => {
    if( err){
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Incorrect username or password.'
      });
    }
    return res.json( {
      success: true,
      message: "Login success",
      token,
      user: {name: userData.name}
    });
  })(req, res, next);
});

router.post( '/change', (req, res, next) => {
  const valid = validatePasswordForm( req.body);
  if( !valid.success){
    const {errors, message} = valid;
    return res.status( 400).json( {success:false, errors, message});
  }
  return passport.authenticate( 'local-login', ( err, token, userData) => {
    if( err){
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Incorrect username or password.'
      });
    }
    User.findOne( {email: userData.email}, function( err, user){
      if( err || !user){
        console.error( "user count error:", err);
        return res.status(400).json({ success:false, message: err.message});
      } else {
        user.password = req.body.new_password;
        user.save( (err) => {
          if( err){
            console.error( "update user failed:", err);
            return res.status( 400).json( {success:false, message: err.message});
          }
          const payload = { sub: user._id};
          const token = jwt.sign( payload, process.env.jwtSecret);
          return res.json( {
            success: true,
            message: "Change success",
            token,
            user: {name: user.name}
          });
        });
      }
    });
  })(req, res, next);
});

module.exports = router;
