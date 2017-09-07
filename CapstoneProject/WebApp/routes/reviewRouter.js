var express = require('express');
var mongoose = require('mongoose');

var Reviews = require('../models/reviews');
var reviewRouter = express.Router();
var Verify = require('./verify');

reviewRouter.route('/')

.get(function(req, res, next){
    Reviews.find(req.query)
        .populate('postedBy')
        .populate('product')
        .exec(function (err, review) {
        if (err) return next(err);
        res.json(review);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Reviews.create(req.body, function (err, review) {
        if (err) return next(err);
        res.json(review);
    });  
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Reviews.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

reviewRouter.route('/:_id')

// .get(function(req, res, next){
//     Reviews.findById(req.params._id)
//         .exec(function (err, review) {
//         if (err) next(err);
//         res.json(review);
//     });
// })

// .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
//     Reviews.findByIdAndUpdate(req.params._id, {
//         $set: req.body
//     }, {
//         new: true   // indicates callback function will return the updated item
//     }, function (err, review) {
//         if (err) next(err);
//         res.json(review);
//     });
// })

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Reviews.findByIdAndRemove(req.params._id, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

reviewRouter.route('/:_id/products/:_prodId')

.get(Verify.verifyOrdinaryUser, function(req, res, next){
    Reviews.find({product: req.params._prodId})
        .populate('products')
        .exec(function (err, review) {
        if (err) return next(err);
        res.json(review);
    });
})

.post(Verify.verifyOrdinaryUser, function(req, res, next) {
    Reviews.create(req.body, function (err, review) {
        if (err) return next(err);
        res.json(review);
    }); 
})

module.exports = reviewRouter;
