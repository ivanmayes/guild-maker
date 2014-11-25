
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        schoolId: { type: String },
        sport:    { type: String },
        season:   { type: String },
        level:    { type: String },
        gender:   { type: String },
        mascot:   { type: String }
    },
    {
        autoIndex: false
    }
);

exports = module.exports = mongoose.model( 'Team' , schema );
