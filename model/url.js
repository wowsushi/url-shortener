const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UrlSchema = new Schema({
  link: {
    type: String,
    required: true,
    unique: true
  },
  shortened: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('URL', UrlSchema)
