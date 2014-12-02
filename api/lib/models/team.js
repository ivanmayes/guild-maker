
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        schoolId: { type: mongoose.Schema.Types.ObjectId , ref: 'School' },
        sport:    { type: String },
        season:   { type: String },
        level:    { type: String },
        gender:   { type: String },
        mascot:   { type: String }
    }
);

schema.index({
    sport:  'text',
    season: 'text',
    level:  'text',
    gender: 'text',
    mascot: 'text'
});

exports = module.exports = mongoose.model( 'Team' , schema );
