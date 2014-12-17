
'use strict';

var mongoose = require( 'mongoose' ),
    notifcationsSchema, schema;

notifcationsSchema = new mongoose.Schema(
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

schema = new mongoose.Schema(
    {
        username:      { type: String },
        firstName:     { type: String },
        lastName:      { type: String },
        email:         { type: String , index: { unique: true , dropDups: true } },
        password:      { type: String },
        accounts:      { type: Array },
        devices:       { type: Array },
        roles:         { type: Array },
        group:         { type: String },
        createdTime:   { type: Date , default: Date.now },
        lastVisitTime: { type: Date , default: Date.now },
        birthday:      { type: Date },
        followedTeams: [{ type: mongoose.Schema.Types.ObjectId , ref: 'Team' }],
        preferences:   [notifcationsSchema]
    }
);

schema.index({
    username:  'text',
    firstName: 'text',
    lastName:  'text',
    email:     'text'
});

exports = module.exports = mongoose.model( 'User', schema );
