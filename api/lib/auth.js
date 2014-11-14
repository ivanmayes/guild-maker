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

var EventEmitter   = require( 'events' ).EventEmitter,
    util           = require( 'util' ),
    hat            = require( 'hat' ),
    oauth2orize    = require( 'oauth2orize' ),
    passport       = require( 'passport' ),
    BearerStrategy = require( 'passport-http-bearer' ).Strategy,
    hat            = require( 'hat' ),
    bcrypt         = require( 'bcrypt' ),
    _              = require( 'lodash' );

var log = global.log;

var Auth = function Auth( options ) {
    this._server = null;
    this.options( options );
};

util.inherits( Auth, EventEmitter );

Auth.prototype.options = function options( opts ) {
    this._options = _.extend( {
        userModel: null,
        accessToken: null
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

Auth.prototype.createToken = function createToken( client, user, scope, done ) {
    var auth  = this,
        accessToken;

    if ( !this._options ) {
        this._options = {};
    }

    // we don't really care about clients right now,
    // if we did, we would probably want to verify the client is registered
    if ( !client ) {
        client = { id: '12345' };
    }

    if ( !this._options.accessToken ) {
        throw new Error( 'AccessToken must be provided to the auth module.' );
    }

    accessToken = this._options.accessToken;

    accessToken.createToken({
        'client': client,
        'user':   user,
        'scope':  scope
    },
    function( err , token ) {
        if ( err ) {
            return done( err );
        }
        done( null, token );
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
Auth.prototype.exchangePassword = function exchangePassword( client, username, password, scope, done ) {
    var self = this,
        User, accessToken;

    // we don't really care about clients right now,
    // if we did, we would probably want to verify the client is registered
    if ( !client ) {
        client = { id: '12345' };
    }

    if ( !this._options.userModel ) {
        throw new Error('A User model must be provided to the auth module.');
    }

    User = this._options.userModel;

    if ( !this._options.accessToken ) {
        throw new Error( 'AccessToken must be provided to the auth module.' );
    }

    accessToken = this._options.accessToken;

    User.findOne({
        'email': username
    },
    function ( err , user ) {
        if ( err ) {
            return done( err , null );
        }

        if ( !user ) {
            return done( null , false );
        }

        self.checkPassword(
            password,
            user.password,
            function ( err , match ) {
                if ( err ) {
                    // Somebody set us up the bomb!!!
                    // What happen?
                    done( err , null );
                    return;
                }

                if ( !match ) {
                    // passwords be funky
                    done( null , false );
                    return;
                }

                // the passwords match what is in db
                // i.e. valid user, see if they have a token.
                accessToken.model
                    .findOne({
                        'userId': user._id.toString()
                    },
                    function ( err , token ) {
                        if( err ){
                            done( err , null );
                            return;
                        }

                        if( token ) {
                            done( null, token );
                            return;
                        }

                        // user doesn't have a token... create one
                        self.createToken(
                            client,
                            user,
                            scope,
                            function ( err , token ) {
                                if( err ){
                                    done( err , null );
                                    return;
                                }

                                done( null, token );
                            }
                        );
                    }
                );
            }
        );
    });
};

Auth.prototype.hashPassword = function hashPassword( password, done ) {
    bcrypt.hash( password, 8, done );
};

Auth.prototype.checkPassword = function checkPassword( password, hash, done ) {
    bcrypt.compare( password, hash, done );
};

Auth.prototype.bearerStrategy = function bearerStrategy() {
    var accessToken, User;

    if ( !this._options.accessToken ) {
        throw new Error('AccessToken must be provided to the auth module.');
    }
    accessToken = this._options.accessToken;

    if ( !this._options.userModel ) {
        throw new Error('A User model must be provided to the auth module.');
    }
    User = this._options.userModel;

    return new BearerStrategy(
        function( token , done ) {
            accessToken.model
                .findOne({
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
                }
            );
        }
    );
};

/**
 * Connect middleware to require a valid user access token.
 */
Auth.prototype.requireUser = function requireUser( req, res, next ) {
    passport.authenticate( 'bearer', function(err, user, info) {
        if ( err ) {
            return next( err );
        }

        if ( !user ) {
            if ( info && info.indexOf( 'invalid_token' ) !== -1 ) {
                return res.json( {
                    meta: {
                        code: 401,
                        errorType: 'invalid_auth',
                        errorDetail: "The access_token provided was not valid."
                    }
                } );
            }
            return res.json( {
                meta: {
                    code: 400,
                    errorType: 'param_error',
                    errorDetail: "The access_token parameter must be passed to access this resource."
                }
            } );
        }
        req.user = user;
        return next();
    } )( req, res, next );
};

// @todo Is this a good idea to create this module as a instantiatable function?
//       Seems we'll have to do additional binding if we want to use `this`.
//       The plus side is it should be a bit more testable and we can
//       use the EventEmitter prototype to publish events.
//       Might be simpler to treat this as a static namespace than
//       instantiatable function though.
exports = module.exports = new Auth();
