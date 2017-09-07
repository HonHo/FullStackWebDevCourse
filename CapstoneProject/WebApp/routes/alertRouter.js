var express = require('express');
var mongoose = require('mongoose');

var Alerts = require('../models/alerts');
var alertRouter = express.Router();
var Verify = require('./verify');

alertRouter.route('/')

.get(function(req, res, next){
    Alerts.find(req.query)
        .populate('product')
        .exec(function (err, alert) {
        if (err) return next(err);
        res.json(alert);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Alerts.create(req.body, function (err, alert) {
        if (err) return next(err);
        res.json(alert);
    });  
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Alerts.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

alertRouter.route('/:_id')

.get(function(req, res, next){
    Alerts.findById(req.params._id)
        .exec(function (err, alert) {
        if (err) return next(err);
        res.json(alert);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Alerts.findByIdAndUpdate(req.params._id, {
        $set: req.body
    }, {
        new: true   // indicates callback function will return the updated item
    }, function (err, alert) {
        if (err) return next(err);
        res.json(alert);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Alerts.findByIdAndRemove(req.params._id, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

module.exports = alertRouter;
