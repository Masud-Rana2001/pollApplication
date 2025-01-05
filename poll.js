const { Schema, model } = require('mongoose');


const pollSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [
      {
        name: 'string',
        vote: Number
      }
    ]
  },
  totalVotes: {
    type: Number,
    default: 0
  }
})

const Poll = model('poll', pollSchema);

module.exports = Poll;