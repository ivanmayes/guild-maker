
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        audience:       [{ type: String }],
        type:           { type: String },
        eventId:        { type: mongoose.Schema.Types.ObjectId , ref: 'Event' },
        schoolId:       { type: mongoose.Schema.Types.ObjectId , ref: 'School' },
        teamIds:        [{ type: mongoose.Schema.Types.ObjectId , ref: 'Team' }],
        creator:        { type: mongoose.Schema.Types.ObjectId , ref: 'User' },
        source:         { type: String },
        content:        { type: String },
        channels:       [{ type: String }],
        channelContent: [{ type: mongoose.Schema.Types.Mixed }],
        publishTime:    { type: Date },
        expireTime:     { type: Date },
        status:         { type: String },
        inappropriate:  { type: Boolean }
    }
);

schema.index({
    audience:    1,
    publishTime: -1
});

schema.index({
    teamIds:     1,
    publishTime: -1
});

schema.index({
    eventId:     1,
    publishTime: -1
});

schema.index({
    schoolId:    1,
    publishTime: -1
});

schema.index({
    type:           'text',
    creator:        'text',
    source:         'text',
    content:        'text',
    channels:       'text',
    channelContent: 'text',
    status:         'text'
});

exports = module.exports = mongoose.model( 'Message' , schema );
