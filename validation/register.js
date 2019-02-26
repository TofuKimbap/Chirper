// Validates and sanitizes strings only.
const Validator = require("validator")
// Use custom validator that also checks for objects, undefined and null.
const isEmpty = require("./is-empty")

const validateRegisterInput = data => {
  const errors = {}

  const { name, email, password, password2 } = data

  // Check name
  if (isEmpty(name)) {
    errors.name = "Name field is required"
  } else if (!Validator.isLength(name, { min: 2, max: 15 })) {
    errors.name = "Name must be between 2 and 15 characters"
  }

  // Check email
  if (isEmpty(email)) {
    errors.email = "Email field is required"
  } else if (!Validator.isEmail(email)) {
    errors.email = "Email is invalid"
  }

  // Check password
  if (isEmpty(password)) {
    errors.password = "Password field is required"
  } else if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters"
  }

  // Check password2
  if (isEmpty(password2)) {
    errors.password2 = "Confirm Password field is required"
  } else if (!Validator.equals(password, password2)) {
    errors.password2 = "Passwords must match"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateRegisterInput
