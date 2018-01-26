var express = require('express');
var router = express.Router();
const Person = require('../models/Person');
const async = require('async');
const faker = require('faker');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";
const mongoose = require('mongoose');
var sys = require('sys')
var exec = require('child_process').exec;
var child;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',foundPerson: {} });
});

router.get('/generate', (req,res,next)=>{
  var person = new Person(faker.helpers.contextualCard());
  person
    .save()
    .then(result=>{
      console.log(result);
      res.status(201).json(result);
    })
    .catch(err=> {
      console.log(err);
      res.status(500).json({error: err});
    });
});

router.get('/create', function(req, res, next) {
  res.redirect('/');

});

router.post('/create', function(req, res, next) {
  var person = new Person({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone
  });
  person.save();
  res.redirect('/');
})

router.get('/get-data', function(req, res, next) {
  Person.find()
      .then(function(doc) {
        console.log(doc);
        res.render('index', {people: doc});
      });
});

router.get('/get-id/:id', function(req, res, next) {
  Person.aggregate([
    {"$match": { _id: mongoose.Types.ObjectId(req.params.id)} },
    { "$lookup": {
          "from": "person.vermongo",
          "localField": "_id",
          "foreignField": "_id._id",
          "as": "versions" }
    }
    ])
    .exec(function(err, doc) {
      if (err) {
        throw(err);
      }
      console.log("doc---------------------------->: " + JSON.stringify(doc));
      res.render('index', {people: doc});
  });
});

router.post('/insert', function(req, res, next) {
  var person = {
    title: req.body.name,
    content: req.body.email,
    author: req.body.username
    
  };

  var data = new Person(person);
  data.save();

  res.redirect('/');
});

router.get('/random', function(req, res, next) {
  var person = new Person(faker.helpers.contextualCard());
  console.log(person);
  res.render('index', {person: person});
})

router.post('/update', function(req, res, next) {
  var id = req.body.id;

  Person.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.name = req.body.name;
    doc.email = req.body.email;
    doc.username = req.body.username;
    doc.save();
  })
  res.redirect('/');
});

router.post('/update-id/:id', function(req, res, next) {
  var id = req.params.id;

  Person.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.name = req.body.name;
    doc.email = req.body.email;
    doc.username = req.body.username;
    doc.save();
  })
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  Person.findByIdAndRemove(id).exec();
  res.redirect('/');
});

router.post('/find', function(req, res, next) {
  var id = req.body.id;
  Person.findById(id)
  .exec()
  .then(doc => {
    console.log(doc);
    res.render('index',{foundPerson: doc });
  })
  .catch(err => {
     console.log(err);
     res.redirect('/');
  });
  res.redirect('/');
});

router.get('/cmd', (req, res, next) => {
 
  child = exec("ps -ef | grep mongod | grep -v grep", function (error, stdout, stderr) {
    sys.print('stdout: ' + stdout);
    sys.print('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
// or more concisely
});

module.exports = router;
