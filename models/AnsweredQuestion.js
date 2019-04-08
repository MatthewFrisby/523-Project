const mongoose = require('mongoose');

const AnsweredQuestionSchema = new mongoose.Schema({
  question: {
    type:  String,
    required: true,
    ref: 'Question'
  },
  answer: {
    type: String
  },
  superuserid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'SuperUser'
  }
});

const AnsweredQuestion = mongoose.model('AnsweredQuestion', AnsweredQuestionSchema);
module.exports = AnsweredQuestion;