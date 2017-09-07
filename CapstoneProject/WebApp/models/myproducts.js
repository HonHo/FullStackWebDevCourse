// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var myproductSchema = new Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }]
    }, 
    {
        timestamps: true
    });

module.exports = mongoose.model('MyProduct', myproductSchema, 'myproducts');