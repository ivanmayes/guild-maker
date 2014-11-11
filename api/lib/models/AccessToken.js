
var mongoose = require( 'mongoose' );

module.exports = exports = mongoose.model( 'AccessToken', {
    token:         String,
    userId:        mongoose.Schema.Types.ObjectId,
    clientId:      String,
    valid:         Boolean,
    invalidReason: String
} );

