
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema( {
    username:      { type: String },
    firstName:     { type: String },
    lastName:      { type: String },
    email:         { type: String , index: { unique: true , dropDups: true } },
    password:      { type: String },
    accounts:      { type: Array },
    devices:       { type: Array },
    roles:         { type: Array },
    createdTime:   { type: Date , default: Date.now },
    lastVisitTime: { type: Date , default: Date.now },
    birthday:      { type: Date },
    followedTeams: { type: Array },
    preferences:   { type: Array }
}, { autoIndex: false } );

exports = module.exports = mongoose.model( 'User', schema );
