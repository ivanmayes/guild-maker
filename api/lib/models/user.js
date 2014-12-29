
'use strict';

var mongoose = require( 'mongoose' ),
    notifcationsSchema, schema;

schema = new mongoose.Schema(
    {
        username:      { type: String },
        firstName:     { type: String },
        lastName:      { type: String },
        email:         { type: String , index: { unique: true , dropDups: true } },
        password:      { type: String },
        accounts:      { type: Array },
        devices:       { type: Array },
        createdTime:   { type: Date , default: Date.now },
        lastVisitTime: { type: Date , default: Date.now },
        birthday:      { type: Date },
    }
);

schema.index({
    username:  'text',
    firstName: 'text',
    lastName:  'text',
    email:     'text'
});

exports = module.exports = mongoose.model( 'User', schema );
