
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        Name: { type: String },
        User: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        Plants: [],
        DateCreated: { type: Date },
        DateModified: { type: Date }
    }
);

schema.index({
    Name:       'text'
});

exports = module.exports = mongoose.model( 'List' , schema );