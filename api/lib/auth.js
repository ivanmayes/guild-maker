/**
 * Shoptology Auth module
 *
 * We secure our API endpoints using OAuth2.
 * Since right now, we are running both the
 * auth server and creating the client consumer,
 * we are focused on the password exchange method
 * for retrieving an access token from a username/password.
 *
 * We'll use the user email address as the username.
 *
 */

'use strict';

var _              = require( 'lodash' ),
    EventEmitter   = require( 'events' ).EventEmitter,
    Promises       = require( 'bluebird' ),
    bcrypt         = require( 'bcrypt' ),
    passport       = require( 'passport' ),
    BearerStrategy = require( 'passport-http-bearer' ).Strategy,
    oauth2orize    = require( 'oauth2orize' ),
    hat            = require( 'hat' ),
    util           = require( 'util' ),
    Envelope       = require( './envelope' ),
    envelope, log;

log = global.log;

var Auth = function Auth( options ) {
    this._server = null;
    this.options( options );
};

util.inherits( Auth, EventEmitter );

Auth.prototype.options = function options( opts ) {
    this._options = _.extend( {
        userModel: null,
        accessTokenModel: null
    }, opts );

    return this;
};

Auth.prototype.server = function server( ) {
    if ( !this._server ) {
        this._server = oauth2orize.createServer();
        this.configureServer( this._server );
    }
    return this._server;
};

Auth.prototype.configureServer = function configureServer( server ) {
    server.grant( oauth2orize.grant.token( this.createToken.bind( this ) ) );
    // https://github.com/jaredhanson/oauth2orize/issues/28#issuecomment-15856324
    server.exchange( oauth2orize.exchange.password( this.exchangePassword.bind( this ) ) );
};

Auth.prototype.configureExpress = function configureExpress( app ) {
    app.use( passport.initialize() );
    passport.use( this.bearerStrategy() );
};

Auth.prototype.createToken = function createToken( client , user , scope ) {
    var auth  = this,
        accessTokenModel;

    if ( !this._options ) {
        this._options = {};
    }

    // we don't really care about clients right now,
    // if we did, we would probably want to verify the client is registered
    if ( !client ) {
        client = { id: '12345' };
    }

    if ( !this._options.accessTokenModel ) {
        throw new Error( 'AccessToken model must be provided to the auth module.' );
    }

    accessTokenModel = this._options.accessTokenModel;

    return accessTokenModel.createToken({
            'client': client,
            'user':   user,
            'scope':  scope
        })
        .then( function( token ) {
            return token;
        })
        .catch( function( err ) {
            throw err;
        });
};

// SRP would be nice... but requires multiple steps,
// probably just stick with sending passwords over the line.
// We'll be using SSL/TLS anyway.
//
// Here's an example that's not far from what we're doing.
// Except we're not going to bother with the refresh token ( and the refresh
// token example in here is not very secure since it doesn't check the client secret )
// http://rwlive.wordpress.com/2014/06/24/oauth2-resource-owner-password-flow-using-oauth2orize-express-4-and-mongojs/
Auth.prototype.exchangePassword = function exchangePassword( client , username , password , scope ) {
    var self = this,
        userModel, user, accessTokenModel;

    // we don't really care about clients right now,
    // if we did, we would probably want to verify the client is registered
    if ( !client ) {
        client = { id: '12345' };
    }

    if ( !this._options.userModel ) {
        throw new Error('A User model must be provided to the auth module.');
    }

    userModel = this._options.userModel;

    if ( !this._options.accessTokenModel ) {
        throw new Error( 'AccessToken Model must be provided to the auth module.' );
    }

    accessTokenModel = this._options.accessTokenModel;

    return userModel.findOneAsync({
        'email': username
    })
    .then( function ( usr ) {
        var error;
        if ( !usr ) {
            error = new Error( 'A user was not found with the given username/password.' );
            error.statusCode = 401;
            throw error;
        }

        // cache value in closure
        user = usr;

        return self.checkPassword( password , usr.password );
    })
    .then( function ( match ) {
        var error;
        if( !match ){
            error = new Error( 'A user was not found with the given username/password.' );
            error.statusCode = 401;
            throw error;
        }

        return accessTokenModel.findOneAsync({
            'userId': user._id.toString()
        });
    })
    .then( function ( token ) {
        if( token ){
            return {
                user:  user,
                token: token
            };
        }
        // user doesn't have a token... create one
        return self.createToken( client , user , scope );
    })
    .then( function ( token ) {
        if( token ){
            return {
                user:  user,
                token: token
            };
        }
    })
    .catch( function ( err ) {
        throw err;
    });
};

Auth.prototype.hashPassword = function hashPassword( password ) {
    return new Promises( function ( resolve , reject ){
        bcrypt.hash( password, 8, function ( err , hash ) {
            if( err ) {
                return reject( err );
            }
            return resolve( hash );
        });
    });
};

Auth.prototype.checkPassword = function checkPassword( password , hash ) {
    return new Promises( function ( resolve , reject ){
        bcrypt.compare( password , hash , function ( err , match ) {
            if( err ) {
                reject( err );
            }
            resolve( match );
        });
    });
};

Auth.prototype.bearerStrategy = function bearerStrategy() {
    var accessTokenModel, User;

    if ( !this._options.accessTokenModel ) {
        throw new Error('AccessToken model must be provided to the auth module.');
    }
    accessTokenModel = this._options.accessTokenModel;

    if ( !this._options.userModel ) {
        throw new Error('A User model must be provided to the auth module.');
    }
    User = this._options.userModel;

    return new BearerStrategy(
        function( token , done ) {
            accessTokenModel.findOne({
                'token': token
            },
            function ( err , token ) {
                var userId, user;

                if ( err ) {
                    return done( err );
                }

                if( !token ){
                    return done( null , false );
                }

                userId = token.userId;

                User.findOne({
                    '_id': userId
                },
                function ( err , usr ) {
                    user = usr;
                    if ( err ) {
                        return done( err );
                    }
                    if ( !user ) {
                        return done( null , false );
                    }
                    return done( null , user , { scope: 'all' } );
                });
            });
        });
};

/**
 * Connect middleware to require a valid user access token.
 */
Auth.prototype.requireUser = function requireUser( req , res , next ) {
    passport.authenticate( 'bearer' , function( err , user , info ) {
        if ( err ) {
            return next( err );
        }

        envelope = new Envelope();

        if ( !user ) {
            if ( info && info.indexOf( 'invalid_token' ) !== -1 ) {
                envelope.error( 401 , {
                    'details': 'The access_token provided was not valid.',
                    'append':  true
                });

                return res.json( envelope );
            }
            envelope.error( 400 , {
                'details': 'The access_token parameter must be passed to access this resource.',
                'append':  true
            });

            return res.json( envelope );
        }
        req.user = user;
        return next();
    } )( req , res , next );
};

// @todo Is this a good idea to create this module as a instantiatable function?
//       Seems we'll have to do additional binding if we want to use `this`.
//       The plus side is it should be a bit more testable and we can
//       use the EventEmitter prototype to publish events.
//       Might be simpler to treat this as a static namespace than
//       instantiatable function though.
exports = module.exports = new Auth();
