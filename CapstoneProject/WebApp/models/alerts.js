// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var alertSchema = new Schema({
        headline: {
            type: String,
            required: true
        },
        alert: {
            type: String,
            required: true
        }       
    }, 
    {
        timestamps: true
    });

module.exports = mongoose.model('Alert', alertSchema, 'alerts');