const Validator = require("validator")

const isEmpty = require("./is-empty")

const validateLoginInput = data => {
  const errors = {}

  const { email, password } = data

  // Check email
  if (isEmpty(email)) {
    errors.email = "Email field is required"
  } else if (!Validator.isEmail(email)) {
    errors.email = "Email is invalid"
  }

  // Check password
  if (isEmpty(password)) {
    errors.password = "Password field is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = validateLoginInput
