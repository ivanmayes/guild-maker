
'use strict';

var mongoose   = require( 'mongoose' ),
    hat        = require( 'hat' ),
    tokenModel = require( './models/Token' ),
    AccessToken;

AccessToken = function AccessToken () {

    this.errCount = 0;
    this.model    = tokenModel;

    return this;
};

AccessToken.prototype.ERROR_MAX = 3;

AccessToken.prototype.generateToken = function generateToken() {
    return hat( 512 , 16 );
};

AccessToken.prototype.tokenCheck = function tokenCheck ( token , done ) {
    this.model
            .findOne({
                token: token
            },
            function ( err , results ) {
                if( err ) {
                    done( err , null );
                }
                if( results ) {
                    // found a model with that token, return false
                    done( null , false );
                }
                else {
                    // didn't find a model with that token, return true
                    done( null , true );
                }
            });

    return this;
};

AccessToken.prototype.createToken = function createToken( options , done ) {
    var opts   = options || {},
        token  = this.generateToken(),
        client = opts.client,
        user   = opts.user,
        scope  = opts.scope,
        model  = this.model,
        self   = this;

    this.tokenCheck( token , function ( err , res ) {
        if( err ) {
            console.log( 'error' , err );
            return;
        }
        if( !res ) {
            // console.log( 'Token Exists!' );
            self.errCount++;
            if( self.errCount < self.ERROR_MAX ) {
                self.createToken( options , done );
            }
            else {
                done( new Error( 'Exceeded maximum token create attempts' ) , null );
            }
        }
        else {
            model.create({
                token:    token,
                userId:   user._id, // @todo with mongoose, can this just be user.id?
                clientId: client.id,
                valid: true
            },
            function( err ) {
                if ( err ) {
                    return done( err );
                }
                self.errCount = 0;
                done( null, token );
            });
        }
    });

    return this;
};

AccessToken.prototype.remove = function remove( token , done ) {
    var opts = ( !token ) ? {} : { token: token };

    this.model
        .remove( opts , done );

    return this;
};

module.exports = exports = AccessToken;
