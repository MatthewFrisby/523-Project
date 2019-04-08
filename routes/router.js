const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();
const Admin = require('../models/Admin');
const SuperUser = require('../models/SuperUser');
const AccountSAQ = require('../models/AccountSAQ');
const SubUser = require('../models/SubUser');
const Question = require('../models/Question');
const SAQTemplate = require('../models/SAQTemplate');
const Skeleton = require('../models/skeleton');
const s3Handling = require('../services/file-upload');
const mongoose = require('mongoose');
const Mail = require('../services/email-send');

var corsOptions = {
  credentials: true,
  origin: 'http://localhost:4200',
  httpOnly: false,
  secure: false,
};

router.options('*', cors())
router.use(cors());

// Superuser registration
router.post('/api/register', cors(corsOptions), (req, res, next) => {

  var superUserData = {
    email: req.body.email,
    fname: req.body.fname,
    lname: req.body.lname,
    password: req.body.password,
    address: req.body.address,
    company: req.body.company,
    telephone: req.body.telephone
  }

  SuperUser.create(superUserData, function(error, superuser) {
    if (error) {
      return next(error);
    } else {
      req.session.superuserId = superuser._id;
      Mail.sendMail(req.body.email, (err) => {
        if (err) {
          return next(err);
        }
      });
      return res.status(error ? 500 : 200).send(error ? error : {
        message: "Super User has been registered",
        data: superuser
    });
  }
  });
});

// Superuser login
router.post('/api/login', cors(corsOptions), (req, res, next) => {
var superuserdata = {
  email: req.body.email,
  password: req.body.password
}

SuperUser.authenticate(superuserdata.email, superuserdata.password, function(error, superuser) {
  if (error || !superuser) {
    var err = new Error('Wrong username or password.');
    err.status = 401;
    return next(error);
  } else {
    req.session.superuserId = superuser._id;

    return res.status(err ? 500 : 200).send(err ? err :
      {
      message: "Super User has been logged in",
      data: superuser
    });
  }
});
});

//get superuser information
router.get('/api/superuser/find/:_id', cors(corsOptions),function(req, res, next){
SuperUser.findById(req.params._id).exec((err, superuser) => {
  if (err) {
    return res.json({success: false, message: err.message});
  } else {
    return res.json({success: true, data: superuser});
  }
});

})

//check if authenticated
router.get('/api/superuser/auth', cors(corsOptions),function(req, res, next){
  var auth = "false"
  var err = new Error('Not Authorized');
  if(req.session.superuserId){
    err.status = 200;
    auth = "true";
  }else{
    err.status = 401;
    auth = "false";
  }

  return res.json({status: err.status, data: [auth]});

});

/* Create Subuser. SuperUser ID stored in params._id.
JSON format passed needs to be as follows:
{
	"email":"testa@test.com",
	"password":"1234",
	"fname":"Test",
	"lname":"TESTAGAIN",
	"telephone":"012-345-6789"
}
*/
router.post('/api/:_id/create', cors(corsOptions), (req, res, next) => {
  if (req.session && req.params._id == req.session.superuserId) {
    let subUserData = new SubUser();
    SubUser.addSub(subUserData, (err, savedSub) => {
      if (err) {
        return res.json({success: false, message: err.message});
      } else {
        return res.json({success: true, message: "Subuser created", data: savedSub});
      }
    });
  } else {
    var err = new Error('Not Authorized');
    err.status = 400;
    return next(err);
  }
});

/* Post DB questions
JSON format as follows, I choose to manually assign IDs so that we can
better track our form fields and their corresponding IDs.
{
  "questiontext":"What is the date?",
  "answertype":"0",
  "id":"123abc"
} */
router.post('/api/admin/question', (req, res, next) => {
  let newQuestion = new Question({
    questiontext: req.body.questiontext,
    answertype: req.body.answertype,
    _id: req.body.id
  });

  newQuestion.save((err, question) => {
    if (err) {
      return res.json({success: false, message: err.message});
    } else {
      return res.json({success: true, message:'Question posted', data: question});
    }
  });
});

/* Posts SAQ Template. Name is the SAQ type, questions are question IDs
{
	"name":"a",
	"questions":["a2","a1"]
} */
router.post('/api/admin/SAQTemplate', (req, res, next) => {
  let newSAQTemplate = new SAQTemplate({
    name: req.body.name,
    questions: req.body.questions
  });
  newSAQTemplate.save((err, template) => {
    if (err) {
      return res.json({success: false, message: err.message});
    } else {
      return res.json({success: true, message:'SAQ template posted', data: template});
    }
  });
});

// Get questions from SAQTemplate. Just need to pass it the ID of the SAQTemplate.
router.get('/api/SAQ/:id', (req, res, next) => {
  SAQTemplate.findById(req.params.id).populate('questions').exec((err, question) => {
    if (err) {
      return res.json({success: false, message: err.message});
    } else {
      return res.json({success: true, data: question.questions});
    }
  });
});


router.post('/api/SAQ/:_id/AccountSAQ', (req, res, next) => {

});

/* Call to download and update a certain PDF and the database behind it. JSON needs keys of field ids.
JSON format is as follows:
{
	"answers": {
		"c73424df44fb900174f5720":"Mark",
	  "c73424df44fb900174f5721":"itworks",
		"c73424df44fb900174f5722":"haha!"
	},
  "name":"TestWithStreams"
  "templateid":"12yuasd18237ads512x"
} */

router.post('/api/SAQ/:_id/completesaq/:templateid', (req, res, next) => {
  console.log(req.params.templateid +" "+ req.params._id);
  AccountSAQ.createAndUpdateSAQ(req.params.templateid, req.params._id, req.body.answers, (err, acctSAQ) => {
    if (err) {
      return res.json({success: false, message: err.message});
    } else { 
      AccountSAQ.getAccountSAQJSON(acctSAQ, (err, acctJSON) => {
        if (err) {
          return res.json({success: false, message: err.message});
        } else {
          req.body.answers = acctJSON;
          s3Handling.editForm({Bucket: process.env.S3_BUCKET, Key:req.params.templateid+'.pdf'}, req.body, (err, data) => {
            if (err) {
              return res.json({success: false, message: err.message});
            } else {
              s3Handling.upload(req.params._id, data, req.params.templateid, (err) => {
                if (err) {
                  return res.json({success: false, message: err.message});
                } else {
                  return res.json({success: true, message: "Success"});
                }
              });
            }
          });
        }
      });
    }
  });
});

/* Pass JSON with Folder key to the Folder you want (typically a User ID).
Returns an array of the keys of all files in that folder */
router.get('/api/SAQ/:_id/getkeys', (req, res, next) => {
  s3Handling.getFolderKeys(req.params._id, (err, keyArray) => {
    if (err) {
      return res.json({success: false, message: err.message});
    } else {
      return res.json({success: true, keys: keyArray});
    }
  });
});

/* Allows you to download from the S3 bucket if passed a key. */
router.post('/api/SAQ/getform', (req, res, next) => {
  s3Handling.downloadFile(req.body.key, (err, data) => {
    if (err) {
      return res.json({success: false, message: err.message});
    } else {
      //res.download(data.Body);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=some_file.pdf',
        'Content-Length': data.Body.length
      });
      return res.end(data.Body);
    }
  });
});

// Lists all the keys in the S3 bucket for testing purposes
router.get('/api/admin/S3/keys', (req, res, next) => {
  s3Handling.getFolderKeys(null, (err, keys) => {
    if (err) {
      return res.json({success: false, message: err.message});
    } else {
      return res.json({success: true, message: "Success", data: keys});
    }
  });
});

/* Call to create an account SAQ from a SAQ template.
{
  "templateid":"ads5123",
  "name":"SAQA"
} */
router.post('/api/SAQ/:_id/accountSAQ', (req, res, next) => {
  AccountSAQ.buildAccountSAQ(req.body.templateid, req.params._id, req.body.name, (err, newSAQ) => {
    if (err) {
      return res.json({success: false, message: err.message});
    } else {
      return res.json({success: true, AccountSAQ: newSAQ});
    }
  });
});

router.get('/api/test/accountSAQ', (req, res, next) => {
  AccountSAQ.getAccountSAQJSON(req.body.id, (err, newJSON) => {
    if (err) {
      return res.json({success: false, message: err.message});
    } else {
      return res.json({success: true, questions: newJSON});
    }
  });
});

module.exports = router;
