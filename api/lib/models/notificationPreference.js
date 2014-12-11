
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        enabled: { type: Boolean },
        scope:   { type: String },
        group:   { type: String },
        school:  { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
        team:    { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
        email:   { type: Boolean },
        push:    { type: Boolean },
        sms:     { type: Boolean }
    }
);

schema.index({
    school: 1
});

schema.index({
    team: 1
});

exports = module.exports = mongoose.model( 'NotificationPreference' , schema );
