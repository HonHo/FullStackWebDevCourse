// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var feedSchema = new Schema({
        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }],
        alerts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Alert'
        }]
    }, 
    {
        timestamps: true
    });

module.exports = mongoose.model('Feed', feedSchema, 'feeds');