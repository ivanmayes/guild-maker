
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        fullName:       { type: String },
        shortName:      { type: String },
        initials:       { type: String },
        city:           { type: String },
        state:          { type: String },
        zip:            { type: String },
        division:       { type: String },
        mascot:         { type: String },
        logoColorDark:  { type: String },
        logoColorLight: { type: String },
        storeLink:      { type: String }
    }
);

schema.index({
    fullName:       'text',
    shortName:      'text',
    initials:       'text',
    city:           'text',
    state:          'text',
    division:       'text',
    mascot:         'text'
});

exports = module.exports = mongoose.model( 'School' , schema );
