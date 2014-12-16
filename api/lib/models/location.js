
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        name:      { type: String },
        address1:  { type: String },
        address2:  { type: String },
        city:      { type: String },
        state:     { type: String },
        zip:       { type: String },
        latitude:  { type: String },
        longitude: { type: String },
        schoolId:  { type: mongoose.Schema.Types.ObjectId , ref: 'School' },
        homeTeams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
    }
);

exports = module.exports = mongoose.model( 'Location' , schema );
