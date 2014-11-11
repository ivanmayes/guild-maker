
'use strict';

var mongoose   = require( 'mongoose' ),
    hat        = require( 'hat' ),
    tokenModel = require( './models/Token' ),
    AccessToken;

AccessToken = function AccessToken () {

    this._generateToken = function _generateToken() {
        return hat( 512 , 16 );
    };

    this._tokenCheck = function _tokenCheck( token , done ) {
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
    };

    this.model = tokenModel;

    return this;
};

AccessToken.prototype.createToken = function createToken( options , done ) {
    var opts   = options || {},
        token  = this._generateToken(),
        client = opts.client,
        user   = opts.user,
        scope  = opts.scope,
        model  = this.model;

    this._tokenCheck( token , function ( err , res ) {
        if( err ) {
            console.log( 'error' , err );
            return;
        }
        if( !res ) {
            console.log( 'Token Exists!' );
            this.createToken( options , done );
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
};

module.exports = exports = AccessToken;
