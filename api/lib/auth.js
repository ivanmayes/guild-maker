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

var EventEmitter = require( 'events' ).EventEmitter,
    hat          = require( 'hat' ),
    oauth2orize  = require( 'oauth2orize' ),
    hat          = require( 'hat' ),
    bcrypt       = require( 'bcrypt' ),
    _            = require( 'lodash' );

var Auth = function Auth( options ) {
    this._server = null;
    this.options( options );
};

Auth.prototype.__proto__ = EventEmitter.prototype;

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

Auth.prototype.createToken = function createToken( client, user, scope, done ) {
    var auth  = this,
        AccessToken;

    // we don't really care about clients right now,
    // if we did, we would probably want to verify the client is registered
    if ( !client ) {
        client = { id: '12345' };
    }

    if ( !this._options.accessToken ) {
        throw 'AccessToken must be provided to the auth module.';
    }

    AccessToken = this._options.accessToken;

    AccessToken.createToken({
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
    var AccessToken;

    if ( !this._options.accessToken ) {
        throw 'AccessToken must be provided to the auth module.';
    }
    AccessToken = this._options.accessToken;

    // @todo
    // find user by username
    // i.e. User.findByUsername( username ).then( ... set user );
    // if not found, error
    // if hash of password doesn't match, error
    // i.e. this.checkPassword( password, user.password );

    // Once we have an authenticated user, look for an existing
    // valid access token for this user, client, and scope.
    // If found, return it.
    // If not, call `this.createToken( client, user, scope, done );`

   // you'll need to implement the code to save access tokens
   AccessToken.create(client, username, password, scope, done);
};

Auth.prototype.hashPassword = function hashPassword( password, done ) {
    bcrypt.hash( password, 8, done );
};

Auth.prototype.checkPassword = function checkPassword( password, hash, done ) {
    bcrypt.compare( password, hash, done );
};

// @todo Is this a good idea to create this module as a instantiatable function?
//       Seems we'll have to do additional binding if we want to use `this`.
//       The plus side is it should be a bit more testable and we can
//       use the EventEmitter prototype to publish events.
//       Might be simpler to treat this as a static namespace than
//       instantiatable function though.
exports = module.exports = new Auth();
