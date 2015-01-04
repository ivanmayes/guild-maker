'use strict';

/**
 * GET /
 * Home page.
 */
var mongoose = require( 'mongoose' );
var Plant = require('../models/Plant');

exports.refactor = function(req, res) {
    Plant.find({CommonName: 'Musk Mallow'}, function(err, plants) {
    	for (var i = plants.length - 1; i >= 0; i--) {
    		var plant = plants[i];

    		// Move Ratings
    		plant["Ratings"] = {
    			"PalatableRating":  plant.PalatableRating,
	            "UseRating":  plant.UseRating,
	            "Rating":  plant.Rating,
	            "GrowRating":  plant.GrowRating,
	            "MedicinalRating":  plant.MedicinalRating,
	            "OverallRating":  plant.OverallRating
    		}

    		// Move Functions
    		plant["Functions"] = {
    			NitrogenFixer: plant.NitrogenFixer
    		}
    		if(plant.Wildlife == '1') {
    			plant["Functions"].Wildlife = "F";
    		}




    		console.log(plants[i]);
    		plant.save();
    	};
	});

};
