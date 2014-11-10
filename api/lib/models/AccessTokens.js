
var mongoose = require( 'mongoose' );

module.exports = exports = mongoose.model( 'AccessTokens', {
    token: String,
    userId: mongoose.Schema.Types.ObjectId,
    clientId: String
} );

