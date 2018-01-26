const mongoose = require('mongoose'),
    Schema = require('mongoose').Schema;
const vermongo = require('mongoose-vermongo');

mongoose.Promise = require('bluebird');

const ObjectId = Schema.ObjectId;

const personSchema = new Schema({
    "name": String,
    "username": String,
    "avatar": String,
    "email": String,
    "dob": Date,
    "phone": String,
    "address": {
        "street": String,
        "suite": String,
        "city": String,
        "zipcode": String,
        "geo": {
        "lat": String,
        "lng": String,
        }
    },
    "website": String,
    "company": {
        "name": String,
        "catchPhrase": String,
        "bs": String,
    },
    "lastModified" : {
        type: 'Date',
        default: Date.now()
    },
    "created" : {
        type: 'Date',
        default: Date.now()
    }
}, {collection: 'person'});

personSchema.plugin(vermongo, "person.vermongo");

module.exports = mongoose.model('Person', personSchema);