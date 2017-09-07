var express = require('express');
var mongoose = require('mongoose');

var Manufacts = require('../models/manufacts');
var manufactRouter = express.Router();
var Verify = require('./verify');

manufactRouter.route('/')

.get(function(req, res, next){
    Manufacts.find(req.query)
        .exec(function (err, manufact) {
        if (err) return next(err);
        res.json(manufact);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Manufacts.create(req.body, function (err, manufact) {
        if (err) return next(err);

        // Below code works only if one manufact is submitted.
        // It will return undefined if multiple manufacts
        // are submitted. res.json(manufact); accepts multiple manufacts.

        // console.log('Manufact created!');
        // var id = manufact._id;
        // res.writeHead(200, {
        //     'Content-Type': 'text/plain'
        // });
        // res.end('Added the manufact with id: ' + id);

        res.json(manufact);
    });  
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Manufacts.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

manufactRouter.route('/:_id')

.get(function(req, res, next){
    Manufacts.findById(req.params._id)
        .exec(function (err, manufact) {
        if (err) return next(err);
        res.json(manufact);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Manufacts.findByIdAndUpdate(req.params._id, {
        $set: req.body
    }, {
        new: true   // indicates callback function will return the updated item
    }, function (err, manufact) {
        if (err) return next(err);
        res.json(manufact);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Manufacts.findByIdAndRemove(req.params._id, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

module.exports = manufactRouter;
