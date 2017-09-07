var express = require('express');
var mongoose = require('mongoose');

var MyProducts = require('../models/myproducts');
var myProductRouter = express.Router();
var Verify = require('./verify');

myProductRouter.route('/')

.get(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    //console.log("req.decoded._id: ->" + JSON.stringify(req.decoded._id, null, "\t") + "<-");
    MyProducts.find(req.query)
        .populate('user')
        .populate({path: 'products', populate: {path: 'producedBy'}})
        .exec(function (err, myProduct) {
        if (err) return next(err);
        res.json(myProduct);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    MyProducts.create(req.body, function (err, myProduct) {
        if (err) return next(err);
        res.json(myProduct);
    });  
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    MyProducts.remove({}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

myProductRouter.route('/:_id')

.get(Verify.verifyOrdinaryUser, function(req, res, next) {
    // If input myProduct ID is "0", get products by userId
    if (req.params._id == 0) {
        MyProducts.find({user: req.decoded._id})
            .populate('user')
            .populate({path: 'products', populate: {path: 'producedBy'}})
            .exec(function (err, myProduct) {
            if (err) return next(err);
            res.json(myProduct);
        });
    } else {    // Otherwise, use the myProduct ID - Concern here, if a user knows the myProduct ID of somebody else. Revisit later!!
        MyProducts.findById(req.params._id)
            .populate('user')
            .populate({path: 'products', populate: {path: 'producedBy'}})
            .exec(function (err, myProduct) {
            if (err) return next(err);
            res.json(myProduct);    // retuns null if ID not found
        });
    }
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    MyProducts.findByIdAndRemove(req.params._id, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

myProductRouter.route('/:_id/products')

// Get products by userId
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    MyProducts.find({user: req.decoded._id})
        .populate({path: 'products', populate: {path: 'producedBy'}})
        .exec(function (err, myProduct) {
        if (err) return next(err);
        res.json(myProduct);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    MyProducts.findById(req.params._id, function (err, myproduct) {
        if (err) return next(err);

        if (myproduct != null) {
            myproduct.products.push(req.body);  // one product with all required info. will add prod that is already there!!

            myproduct.save(function (err, myproduct) {
                if (err) return next(err);
                console.log('Saved product for myproduct: ' + req.params._id);
                res.json(myproduct);
            });
        } else {
            console.log('No products to be saved! myproduct not exist: ' + req.params._id);
            res.json(myproduct);
        }
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
    MyProducts.findById(req.params._id)
        .populate('products')
        .exec(function (err, myProduct) {
        if (err) return next(err);

        if (myProduct != null) {
            // for (var i = (myProduct.products.length - 1); i >= 0; i--) {
            //     myProduct.products.id(myProduct.products[i]._id).remove();
            //     myProduct.products.splice(i, 1);
                myProduct.products = [];
            // }
            myProduct.save(function (err, myProduct) {
                if (err) return next(err);
                console.log('Deleted all products for myProduct: ' + req.params._id);
                res.json(myProduct);
            });
        } else {
            console.log('No products to be deleted! myProduct not exist: ' + req.params._id);
            res.json(myProduct);
        }
    });
})

myProductRouter.route('/:_id/products/:_prodId')

// Get product by userId
.get(Verify.verifyOrdinaryUser, function(req, res, next){
    MyProducts.find({user: req.decoded._id})
        .populate({path: 'products', populate: {path: 'producedBy', model: 'Manufact'}})
        .populate({path: 'products', populate: {path: 'reviews.postedBy', model: 'User'}})
        //.populate({path: 'products', populate: {path: 'reviews', populate: {path: 'postedBy', model: 'User'}}})
        //.populate({path: 'products.reviews', populate: {path: 'postedBy', model: 'User'}})
        .exec(function (err, myProduct) {
        if (err) return next(err);

        if (myProduct != null) {
            if (myProduct.length > 0) {
                var j = -1;
                var prodFound = null;
                for (var i = myProduct[0].products.length - 1; i >= 0; i--) {
                    if (myProduct[0].products[i]._id == req.params._prodId) {
                        prodFound = myProduct[0].products[i];
                    }
                }
                myProduct[0].products = [];
                if (prodFound != null) {
                    myProduct[0].products[0] = prodFound;
                }
                res.json(myProduct);
            } else {
                res.json(myProduct);
            }
        } else {
            res.json(myProduct);
        }
    });
})

// Update product by userId and prodId
.put(Verify.verifyOrdinaryUser, function(req, res, next) {
    MyProducts.find({user: req.decoded._id}, function (err, myProduct) {
        if (err) return next(err);

        if (myProduct != null) {
            if (myProduct.length == 0) {
                MyProducts.create({user: req.decoded._id}, function (err, myProduct) {
                    if (err) return next(err);

                    myProduct.products.push(req.params._prodId);
                    // console.log("myProduct #1 all: ->" + JSON.stringify(myProduct, null, "\t") + "<-");
                    // console.log("myProduct #1 products: ->" + myProduct.products + "<-");

                    myProduct.save(function (err, myProduct) {
                        if (err) return next(err);
                        console.log('Added to MyProducts (created): ' + req.params._prodId);
                        res.json(myProduct);
                    });
                }); 
            } else {
                // A myProduct object has already created for this user.
                // There should be one-element array, as one user should have only one hash 
                // that stores an array of myProduct products and other info.

                var index = myProduct[0].products.indexOf(req.params._prodId);

                // If not already a myProduct dish
                if (index == -1) {
                    myProduct[0].products.push(req.params._prodId);
                    myProduct[0].save(function (err, myProduct) {
                        if (err) return next(err);
                        console.log('Added to MyProducts (updated): ' + req.params._prodId);
                        res.json(myProduct);
                    });
                } else {
                    console.log('No update! Product already exist: ' + req.params._prodId);
                    res.json(myProduct);
                }
            }
        } else {
            res.json(myProduct);
        }

    }); 

    // MyProducts.findByIdAndUpdate(req.params._prodId, {
    //     $set: req.body
    // }, {
    //     new: true   // indicates callback function will return the updated item
    // }, function (err, myProduct) {
    //     if (err) next(err);
    //     res.json(myProduct);
    // });
})

// Delete product by userId and prodId
.delete(Verify.verifyOrdinaryUser, function(req, res, next) {
    MyProducts.find({user: req.decoded._id}, function (err, myProduct) {
        if (err) return next(err);

        if (myProduct != null) {
            if (myProduct.length > 0) {
                var index = myProduct[0].products.indexOf(req.params._prodId);

                if (index > -1) {
                    myProduct[0].products.splice(index, 1);

                    myProduct[0].save(function (err, myProduct) {
                        if (err) return next(err);
                        console.log('Deleted product from MyProduct: ' + req.params._prodId);
                        res.json(myProduct);
                    });
                } else {
                    res.json(myProduct);
                }
            }  else {
                res.json(myProduct);
            }
        } else {
            res.json(myProduct);
        }

    });
});

module.exports = myProductRouter;
