var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify    = require('./verify');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());
favoriteRouter.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function(req,res,next){
  Favorites.find({'postedBy': req.decoded._doc._id})
    .populate('postedBy')
    .populate('dishes')
    .exec(function (err, favorites) {
        if (err) throw err;
        res.json(favorites);
    });
})

.post(function(req, res, next){
   Favorites.find({'postedBy': req.decoded._doc._id})
   .exec(function (err, favorites) {
   		if (err) throw err;
   		req.body.postedBy = req.decoded._doc._id;
   		if(favorites.length) {
   			var favorited = false;
   			for(var i=0; i < favorites[0].dishes.length; i++) {
   				if(favorites[0].dishes[i] == req.body._id) {
   					favorited = true;
   					break;
   				}
   			}

   			if(!favorited) {
   				favorites[0].dishes.push(req.body._id);
   				favorites[0].save(function (err, favorite) {
   					if (err) throw err;
   					res.json(favorite);
   				})
   			}
   			else {
   				res.json(favorites[0]);
   			}
   		}
   		else {
   			Favorites.create({postedBy: req.body.postedBy}, function (err, favorite) {
   				if (err) throw err;
   				favorite.dishes.push(req.body._id);
   				favorite.save(function (err, favorite) {
   					if (err) throw err;
   					res.json(favorite);
   				})
   			});
   		}
   });
})

.delete(function(req, res, next){
	Favorites.remove({'postedBy': req.decoded._doc._id}, function (err, resp) {
       	if (err) throw err;
        res.json(resp);
    })
});

favoriteRouter.route('/:favoriteId')
.delete(Verify.verifyOrdinaryUser, function(req, res, next){
  	Favorites.find({'postedBy': req.decoded._doc._id}, function (err, favorites){
  		if(err) throw err;
  		if (favorites.length) {
  			for (var i = 0; i < favorites[0].dishes.length; i++) {
  				if(favorites[0].dishes[i] == req.params.favoriteId) {
  					favorites[0].dishes.splice(i,1);
  				}
  			}
  			favorites[0].save(function(err, favorite) {
  				if (err) throw err;
  				res.json(favorites[0]);
  			});
  		}
  		else {
  			res.json('You have no favorites');
  		}
  	});
});

module.exports = favoriteRouter;