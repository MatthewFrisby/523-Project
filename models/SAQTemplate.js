const mongoose = require('mongoose');
const Question = require('./Question')

const SAQTemplateSchema = new mongoose.Schema({
  questions : [{
    type:  String, 
    ref: 'Question',
    required: true
  }],
  _id: {
    type: String,
  }
}, 
{
  timestamps: true
});

const SAQTemplate = mongoose.model('SAQTemplate', SAQTemplateSchema);
module.exports = SAQTemplate;