const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlSchema = new Schema({
  originURL: {
      type: String,
      require: true,
  },
  shortenedURL: {
    type: String,
    require: true,
}
})

module.exports = mongoose.model('Url', urlSchema)