
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        name:            { type: String },
        schoolIds:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }],
        teamIds:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
        homeSchoolId:    { type: mongoose.Schema.Types.ObjectId },
        homeTeamId:      { type: mongoose.Schema.Types.ObjectId },
        type:            { type: String }, // - game, practice, others (define own types)
        description:     { type: String }, // -- maybe we have a separate document collection for teams to write internal notes
        date:            { type: Date },
        startTime:       { type: Date }, // (empty for all-day events)
        endTime:         { type: Date }, // (optional)
        rescheduled:     { type: Boolean },
        dateAdded:       { type: Date , default: Date.now },
        locationId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
        // opponentTeamIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
        score:           { type: String },
        stats:           { type: mongoose.Schema.Types.Mixed }
        // TODO: date/time integer field YYYYMMDD
    }
);

schema.index({
    schoolIds: 1,
    date:      1
});

schema.index({
    teamIds: 1,
    date:    1
});

schema.index({
    description: 'text'
});

exports = module.exports = mongoose.model( 'Event' , schema );
