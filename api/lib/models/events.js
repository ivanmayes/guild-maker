
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        name:            { type: String },
        schoolId:        { type: mongoose.Schema.Types.ObjectId },
        teamId:          { type: mongoose.Schema.Types.ObjectId },
        type:            { type: String }, // game, practice, others (define own types)
        description:     { type: String },
        date:            { type: Date },
        startTime:       { type: Date }, // (empty for all-day events)
        endTime:         { type: Date }, // (optional)
        // calendar // ??
        rescheduled:     { type: Boolean },
        dateAdded:       { type: Date , default: Date.now },
        homeTeam:        { type: Boolean }, // ?? boolean or string?
        locationId:      { type: mongoose.Schema.Types.ObjectId },
        opponentTeamIds: { type: Array },
        score:           { type: String },
        stats:           { type: mongoose.Schema.Types.Mixed }

        // ^^^ So is the idea we would have multiple documents for the same match? We need a way to deduplicate then. Seems we should have a single document.

        name:            { type: String },
        schoolIds:       { type: Array },
        teamIds:         { type: Array },
        homeSchoolId:    { type: mongoose.Schema.Types.ObjectId },
        homeTeamId:      { type: mongoose.Schema.Types.ObjectId },
        type:            { type: String }, // - game, practice, others (define own types)
        description:     { type: String }, // -- maybe we have a separate document collection for teams to write internal notes
        date:            { type: Date },
        startTime:       { type: Date }, // (empty for all-day events)
        endTime:         { type: Date }, // (optional)
        // calendar // ??
        rescheduled:     { type: Boolean },
        dateAdded:       { type: Date , default: Date.now },
        locationId:      { type: mongoose.Schema.Types.ObjectId },
        opponentTeamIds: { type: Array },
        score:           { type: String },
        stats:           { type: mongoose.Schema.Types.Mixed }
    },
    {
        autoIndex: false
    }
);

exports = module.exports = mongoose.model( 'Events' , schema );
