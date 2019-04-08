// To run this script simply run the following command from the home directory: node "Script Stuff/script.js"
const SAQTemplate = require('../models/SAQTemplate.js');
const Question = require('../models/Question.js');
const SuperUser = require('../models/SuperUser');
const mongoose = require('mongoose');

var db = mongoose.connection;
mongoose.connect(  process.env.MONGODB_URI || 'mongodb://localhost:27017/snc');
//mongoose.connect(  'mongodb://localhost:27017/snc');

// Alert of succesful connection/error

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Connected to DB");
});

let user = new SuperUser({
    "email":"admin",
    "password":"password",
    "fname":"test",
    "lname":"test",
    "address":"test",
    "company":"test",
    "telephone":"test",
});

user.save();

let SAQAv3 = new SAQTemplate({
    "questions":["9.5","9.6.a","9.6.b","9.6.1","9.6.2","9.6.3","9.7","9.8.a","9.8.c","9.8.1.a","9.8.1.b","12.8","12.8.1","12.8.2","12.8.3","12.8.4","12.8.5"],
    "_id": "SAQAv3"
});

//only questions from SAQAv3
let questions = [
    {
        "questiontext":"Are all media physically secured (including but not limited to computers, removable electronic media, paper receipts, paper reports, and faxes)?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"9.5"
    },
    {
        "questiontext":"Is strict control maintained over the internal or external distribution of any kind of media?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"9.6.a"
    },
    {
        "questiontext":"Do controls include the following:",
        "answertype":0,
        "answers":[""],
        "_id":"9.6.b"
    },
    {
        "questiontext":"Is media classified so the sensitivity of the data can be determined?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"9.6.1"
    },
    {
        "questiontext":"Is media sent by secured courier or other delivery method that can be accurately tracked?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"9.6.2"
    },
    {
        "questiontext":"Is management approval obtained prior to moving the media (especially when media is distributed to individuals)?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"9.6.3"
    },
    {
        "questiontext":"Is strict control maintained over the storage and accessibility of media?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"9.7"
    },
    {
        "questiontext":"Is all media destroyed when it is no longer needed for business or legal reasons?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"9.8.a"
    },
    {
        "questiontext":"Is media destruction performed as follows:",
        "answertype":0,
        "answers":[""],
        "_id":"9.8.c"
    },
    {
        "questiontext":"Are hardcopy materials cross-cut shredded, incinerated, or pulped so that cardholder data cannot be reconstructed?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"9.8.1.a"
    },
    {
        "questiontext":"Are storage containers used for materials that contain information to be destroyed secured to prevent access to the contents?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"9.8.1.b"
    },
    {
        "questiontext":"Are policies and procedures maintained and implemented to manage service providers with whom cardholder data is shared, or that could affect the security of cardholder data, as follows:",
        "answertype":0,
        "answers":[""],
        "_id":"12.8"
    },
    {
        "questiontext":"Is a list of service providers maintained, including a description of the service(s) provided?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"12.8.1"
    },
    {
        "questiontext":"Is a written agreement maintained that includes an acknowledgement that the service providers are responsible for the security of cardholder data the service providers possess or otherwise store, process, or transmit on behalf of the customer, or to the extent that they could impact the security of the customer’s cardholder data environment? Note: The exact wording of an acknowledgement will depend on the agreement between the two parties, the details of the service being provided, and the responsibilities assigned to each party. The acknowledgement does not have to include the exact wording provided in this requirement.",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"12.8.2"
    },
    {
        "questiontext":"Is there an established process for engaging service providers, including proper due diligence prior to engagement?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"12.8.3"
    },
    {
        "questiontext":"Is a program maintained to monitor service providers’ PCI DSS compliance status at least annually?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"12.8.4"
    },
    {
        "questiontext":"Is information maintained about which PCI DSS requirements are managed by each service provider, and which are managed by the entity?",
        "answertype":1,
        "answers":["Yes", "Yes with CCW", "No", "N/A"],
        "_id":"12.8.5"
    }
];


questions.forEach((question, index, array) => {
    let tempQuest = new Question(question);
    tempQuest.save((err, quest) => {
        if (err) {
            console.log(err) 
        } else {
            if (index + 1 == array.length) {
                SAQAv3.save((err) => {
                    if (err) {
                        console.log(err)
                    } else {
                        mongoose.connection.close();
                    }
                });
            }
        }
    });
});

