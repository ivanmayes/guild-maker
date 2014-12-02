
'use strict';

var hat      = require( 'hat' ),
    mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        token:         { type: String },
        userId:        { type: mongoose.Schema.Types.ObjectId , ref: 'User' },
        clientId:      { type: String },
        valid:         { type: Boolean },
        invalidReason: { type: String }
    }
);

schema.static( 'findByToken' , function ( token ) {
    return this.findOneAsync({
        'token': token
    });
});

schema.static( 'generateToken' , function generateToken() {
    return hat( 512 , 16 );
});

schema.static( 'tokenCheck' , function tokenCheck ( token ) {
    return this.findByToken( token );
});

schema.static( 'createToken' , function createToken( options ) {
    var opts   = options || {},
        token  = this.generateToken(),
        client = opts.client,
        user   = opts.user,
        scope  = opts.scope,
        self   = this;

    return this.tokenCheck( token )
        .then( function( model ) {
            if( model ) {
                return new Error( 'Token Exists' );
            }

            return self.createAsync({
                token:    token,
                userId:   user._id.toString(),
                clientId: client.id,
                valid:    true
            });
        })
        .then( function ( token ) {
            return token;
        })
        .catch( function( err ) {
            return err;
        });

});

exports = module.exports = mongoose.model( 'AccessToken' , schema );
