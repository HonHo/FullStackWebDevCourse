// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

var reviewSchema = new Schema({
        headline: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        review: {
            type: String,
            required: true
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }, 
    {
        timestamps: true
    });

// create a schema
var productSchema = new Schema({
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
        slogan: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        producedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Manufact'
        },
        reviews: [reviewSchema],
        alerts: [alertSchema]
    }, 
    {
        timestamps: true
    });

module.exports = mongoose.model('Product', productSchema, 'products');