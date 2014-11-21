
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        type:           { type: String },
        eventId:        { type: mongoose.Schema.Types.ObjectId },
        schoolId:       { type: mongoose.Schema.Types.ObjectId },
        teamIds:        { type: Array },
        creator:        { type: mongoose.Schema.Types.ObjectId },
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

exports = module.exports = mongoose.model( 'Messages' , schema );
