var express = require('express');
var mongoose = require('mongoose');

var Feeds = require('../models/feed');
var feedRouter = express.Router();
var Verify = require('./verify');

feedRouter.route('/')

.get(function(req, res, next){
    Feeds.find(req.query)
        .populate('reviews')
        .populate('alerts')
        .exec(function (err, alert) {
        if (err) return next(err);
        res.json(alert);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Feeds.create(req.body, function (err, alert) {
        if (err) return next(err);
        res.json(alert);
    });  
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Feeds.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

feedRouter.route('/:_id')

.get(function(req, res, next){
    Feeds.findById(req.params._id)
        .exec(function (err, alert) {
        if (err) return next(err);
        res.json(alert);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Feeds.findByIdAndUpdate(req.params._id, {
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

module.exports = feedRouter;
