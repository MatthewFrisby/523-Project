var mongoose = require('mongoose');
const SAQTemplate = require('./SAQTemplate.js');
const AnsweredQuestion = require('./AnsweredQuestion.js');

var AccountSAQSchema = new mongoose.Schema({
  superuserid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'SuperUser'
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  templateid : {
    type: String,
    required: true,
    ref: 'SAQTemplate'
  },
  answeredquestions : [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'AnsweredQuestion',
  }]
},
{
  timestamps: true
});

var AccountSAQ = mongoose.model('AccountSAQ', AccountSAQSchema);
module.exports = AccountSAQ;

module.exports.getAccountSAQJSON = (AccountSAQId, callback) => {
  let JSONvar = {};
  AccountSAQ.findById(AccountSAQId).populate({
    path: 'answeredquestions',
    populate: {path: 'question'}
  }).exec((err, populatedSAQ) => {
    if (err) {
      callback(err)
    } else {
      populatedSAQ.answeredquestions.forEach((item, index, array) => {
        if (err) {
          callback(err);
        } else {
          if (item.question.answertype == 1) {
            JSONvar[item.question._id+item.answer]="X";
          } else if (item.question.answertype != 0) {
            JSONvar[item.question._id] = item.answer;
          }
          if (index + 1 == array.length) callback(err, JSONvar);
        }
      });
    }
  });
}

module.exports.buildAccountSAQ = (templateID, userID, name, callback) => {
  let questionIDs = [];
  SAQTemplate.findById(templateID).populate('questions').exec((err, question) => {
    if (err) {
      callback(err);
    } else {
      question.questions.forEach((item, index, array) => {
        AnsweredQuestion.findOne({question: item._id, superuserid: userID}).exec((err, tempAns) => {
          if (err) {
            callback(err);
          } else {
            if (tempAns != null) {
              questionIDs.push(tempAns._id);
              if (questionIDs.length == array.length) {
                // Need to put this in a function most likely
                let newAccountSAQ = new AccountSAQ({
                  superuserid: userID,
                  name: name,
                  templateid: templateID,
                  answeredquestions: questionIDs
                });
                newAccountSAQ.save(callback(err, newAccountSAQ));
              }
            } else {
              let newAnswered = new AnsweredQuestion({
                question: item._id,
                answer: ' ',
                superuserid: userID
              });
              newAnswered.save((err, savedAnswer) => {
                if (err) {
                  callback(err);
                } else {
                  // Need to put this in a function most likely
                  questionIDs.push(savedAnswer._id);
                  if (questionIDs.length == array.length) {
                    let newAccountSAQ = new AccountSAQ({
                      superuserid: userID,
                      name: name,
                      templateid: templateID,
                      answeredquestions: questionIDs
                    });
                    newAccountSAQ.save(callback(err, newAccountSAQ));
                  }
                }
              });
            }
          }
        });
      });
    }
  });
}

module.exports.createAndUpdateSAQ = (tempID, userID, answers, callback) => {
  AccountSAQ.findOne({superuserid: userID, templateid: tempID}).populate('answeredquestions').exec((err, ansq) => {
    if (err) {
      callback(err);
    } else {
      if (ansq) {
        updateSAQAnswers(ansq, answers, callback);
      } else {
        AccountSAQ.buildAccountSAQ(tempID, userID, tempID + userID, (err, ansq) => {
          if (err) {
            callback(err);
          } else {
            updateSAQAnswers(ansq, answers, callback);
          }
        });
      }
    }
  });
}

let updateSAQAnswers = (ansq, answers, callback) => {
  ansq.answeredquestions.forEach((item, index, array) => {
    if (typeof answers[item.question] === 'undefined') {
      if (index + 1 == array.length) callback(null, AccountSAQ.findById(ansq._id));
    } else {
      item.answer = answers[item.question];
      item.save((err) => {
        if (err) {
          callback(err);
        } else if (index + 1 == array.length) {
          callback(null, ansq._id);
        }
      });
    }
  });
}
