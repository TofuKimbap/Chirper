// Routes use for Authentication

const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const router = express.Router()

const keys = require("../../config/keys")

// Load Validation
const validateRegisterInput = require("../../validation/register")
const validateLoginInput = require("../../validation/login")

// Load User Model
const User = require("../../models/User")

// @route  POST api/users/register
// @desc   Register user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body)

  if (!isValid) {
    return res.status(400).json(errors)
  }

  // Find out if user with given email already exists.
  // Otherwise create new user.
  User.findOne({ email: req.body.email }).findOne(user => {
    if (user) {
      errors.email = "Email already exists"
      return res.status(400).json(errors)
    } else {
      const { name, email, password } = req.body

      const newUser = new User({
        name,
        email,
        password
      })

      // Hash a password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          // Save password as hash
          newUser.password = hash
          // Save new user in database
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
})

// @route  POST api/users/login
// @desc   Login user / Returning JWT token
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body)

  if (!isValid) {
    return res.status(400).json(errors)
  }

  const { email, password } = req.body

  User.findOne({ email }).then(user => {
    // Found user with the email.
    if (user) {
      // Check if password is correct
      bcrypt.compare(password, user.password).then(isMatch => {
        // Password is correct
        if (isMatch) {
          // Create JWT payload
          const { id, name } = user

          const payload = {
            id,
            name
          }

          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: "10h" },
            (err, token) => {
              res.json({
                success: true,
                token: `Bearer ${token}`
              })
            }
          )
        } else {
          errors.password = "Password incorrect"
          return res.status(400).json(errors)
        }
      })
    } else {
      // User with given email does not exist

      errors.email = "User not found"
      return res.status(404).json(errors)
    }
  })
})

module.exports = router
