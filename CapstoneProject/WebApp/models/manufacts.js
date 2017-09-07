// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var manufactSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        }
    }, 
    {
        timestamps: true
    });

// the schema is useless so far
// we need to create a model using it
//var Manufacts = mongoose.model('Manufact', manufactSchema);

// make this available to our Node applications
//module.exports = Manufacts;

module.exports = mongoose.model('Manufact', manufactSchema, 'manufacts');