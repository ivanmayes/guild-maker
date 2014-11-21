
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        firstName:    { type: String },
        lastName:     { type: String },
        fullName:     { type: String },
        teamId:       { type: mongoose.Schema.Types.ObjectId },
        // mechanism should exist to find by email
        userId:       { type: mongoose.Schema.Types.ObjectId }, // email or ObjectId?
        number:       { type: Number },
        positions:    { type: String },
        stats:        { type: mongoose.Schema.Types.Mixed }, // (@todo yunderstand different stats)
        dateAdded:    { type: Date , default: Date.now },
        dateModified: { type: Date , default: Date.now }
    },
    {
        autoIndex: false
    }
);

exports = module.exports = mongoose.model( 'Player' , schema );
