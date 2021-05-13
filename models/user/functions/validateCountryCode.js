// Validate if the given country code matches the phone number

const validator = require('validator');

const Country = require('../../country/Country');

module.exports = (phone, country_code) => {
  return validator.isMobilePhone(phone) && phone.indexOf(country_code.toString()) == 1 && phone[0] == '+';
}
