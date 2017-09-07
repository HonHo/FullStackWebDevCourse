var express = require('express');
var mongoose = require('mongoose');

var Products = require('../models/products');
var productRouter = express.Router();
var Verify = require('./verify');

productRouter.route('/')

.get(function(req, res, next){
    Products.find(req.query)
        .populate('producedBy')
        .populate({path: 'reviews.postedBy', model: 'User'})
        .exec(function (err, product) {
        if (err) return next(err);
        res.json(product);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Products.create(req.body, function (err, product) {
        if (err) return next(err);
        res.json(product);
    });  
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Products.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

productRouter.route('/:_id')

.get(function(req, res, next){
    Products.findById(req.params._id)
        .populate('producedBy')
        .populate({path: 'reviews.postedBy', model: 'User'})
        //.populate('reviews.postedBy')   // works as well
        .exec(function (err, product) {
        if (err) return next(err);
        res.json(product);
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Products.findByIdAndUpdate(req.params._id, {
        $set: req.body
    }, {
        new: true   // indicates callback function will return the updated item
    }, function (err, product) {
        if (err) return next(err);
        res.json(product);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Products.findByIdAndRemove(req.params._id, function (err, product) {
        if (err) return next(err);
        res.json(product);
    });
});

productRouter.route('/:_id/alerts')

.get(function(req, res, next) {        
    Products.findById(req.params._id)
        .exec(function (err, product) {
        if (err) return next(err);
        res.json(product);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Products.findById(req.params._id, function (err, product) {
        if (err) return next(err); 

        if (product != null) {
            product.alerts.push(req.body);  // one alert with all required info

            product.save(function (err, product) {
                if (err) return next(err);
                console.log('Saved alert for product: ' + req.params._id);
                res.json(product);
            });
        } else {
            console.log('No alerts to be saved! Product not exist: ' + req.params._id);
            res.json(product);
        }
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Products.findById(req.params._id, function (err, product) {
        if (err) return next(err);

        if (product != null) {
            for (var i = (product.alerts.length - 1); i >= 0; i--) {
                product.alerts.id(product.alerts[i]._id).remove();
            }
            product.save(function (err, product) {
                if (err) return next(err);
                console.log('Deleted all alerts for product: ' + req.params._id);
                res.json(product);
            });
        } else {
            console.log('No alerts to be deleted! Product not exist: ' + req.params._id);
            res.json(product);
        }
    });
});

productRouter.route('/:_id/alerts/:alertId')

.get(function (req, res, next) {
    Products.findById(req.params._id)
        .exec(function (err, product) {
        if (err) return next(err);

        if (product != null) {
            //if (product.alerts.id(req.params.alertId) != null) {
                res.json(product.alerts.id(req.params.alertId));
            // } else {
            //     res.json({});
            // }
        } else {
            res.json(product);
        }
    });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Products.findById(req.params._id, function (err, product) {
        if (err) return next(err);

        if (product != null) {
            if (product.alerts.id(req.params.alertId) != null) {
                product.alerts.id(req.params.alertId).remove();
                product.alerts.push(req.body);

                product.save(function (err, product) {
                    if (err) return next(err);
                    console.log('Updated alert for product: ' + req.params._id);
                    res.json(product.alerts[product.alerts.length - 1]);
                });
            } else {
                res.json(null);
            }
        } else {
            console.log('No alerts to be updated! Product not exist: ' + req.params._id);
            res.json(product);
        }
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Products.findById(req.params._id, function (err, product) {
        if (err) return next(err);

        if (product != null) {
            var alertToBeDeleted = product.alerts.id(req.params.alertId);
            if (alertToBeDeleted != null) {
                alertToBeDeleted.remove();

                product.save(function (err, product) {
                    if (err) return next(err);
                    console.log('Deleted alert for product: ' + req.params._id);
                    res.json(alertToBeDeleted);
                });
            } else {
                res.json(null);
            }
        } else {
            console.log('No alert to be deleted! Product not exist: ' + req.params._id);
            res.json(product);
        }
    });
});
 
productRouter.route('/:_id/reviews')

.get(function(req, res, next){
    Products.findById(req.params._id)
        .populate({path: 'reviews.postedBy'})
        .exec(function (err, product) {
        if (err) return next(err);
        res.json(product);
    });
})

.post(Verify.verifyOrdinaryUser, function(req, res, next) {
    Products.findById(req.params._id, function (err, product) {
        if (err) return next(err);

        if (product != null) {
            req.body.postedBy = req.decoded._id;    // record reviewer
            product.reviews.push(req.body);  // one review with all required info

            product.save(function (err, product) {
                if (err) return next(err);
                console.log('Saved review for product: ' + req.params._id);
                res.json(product);
            });
        } else {
            console.log('No reviews to be saved! Product not exist: ' + req.params._id);
            res.json(product);
        }
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Products.findById(req.params._id, function (err, product) {
        if (err) return next(err);

        if (product != null) {
            for (var i = (product.reviews.length - 1); i >= 0; i--) {
                product.reviews.id(product.reviews[i]._id).remove();
            }
            product.save(function (err, product) {
                if (err) return next(err);
                console.log('Deleted all reviews for product: ' + req.params._id);
                res.json(product);
            });
        } else {
            console.log('No reviews to be deleted! Product not exist: ' + req.params._id);
            res.json(product);
        }
    });
});

// .put(Verify.verifyOrdinaryUser, 
// .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin,

// productRouter.route('/:_id/reviews/:reviewId')

// .put(Verify.verifyOrdinaryUser, 
// .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin,

module.exports = productRouter;
