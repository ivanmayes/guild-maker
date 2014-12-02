
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        type:           { type: String },
        eventId:        { type: mongoose.Schema.Types.ObjectId , ref: 'Event' },
        schoolId:       { type: mongoose.Schema.Types.ObjectId , ref: 'School' },
        teamIds:        [{ type: mongoose.Schema.Types.ObjectId , ref: 'Team' }],
        creator:        { type: mongoose.Schema.Types.ObjectId , ref: 'User' },
        source:         { type: String },
        content:        { type: String },
        channels:       { type: String },
        channelContent: { type: String }, // ???
        publishTime:    { type: Date },
        expireTime:     { type: Date },
        status:         { type: String },
        inappropriate:  { type: Boolean }
    },
    {
        autoIndex: false
    }
);

exports = module.exports = mongoose.model( 'Message' , schema );
