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
 * @todo we'll make the models be passed in via the constructor options
 */


var EventEmitter = require( 'events' ).EventEmitter,
    hat          = require( 'hat' ),
    oauth2orize  = require( 'oauth2orize' ),
    hat          = require( 'hat' ),
    bcrypt       = require( 'bcrypt' ),
    _            = require( 'lodash' ); // @todo should this be underscore?

var Auth = function Auth( options ) {
    this._server = null;
    this.options( options );
};

Auth.prototype.__proto__ = EventEmitter.prototype;

Auth.prototype.options = function options( options ) {
    this._options = _.extend( {
        userModel: null,
        accessTokenModel: null
    }, options );
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

Auth.prototype.generateToken = function generateToken( ) {
    return hat(512, 16);
};

Auth.prototype.createToken = function createToken( client, user, scope, done ) {
    var AccessToken, auth = this;

    // we don't really care about clients right now,
    // if we did, we would probably want to verify the client is registered
    if ( !client ) {
        client = { id: '12345' };
    }

    if ( !this._options.accessTokenModel ) {
        throw "AccessToken model must be provided to the auth module.";
    }
    AccessToken = this._options.accessTokenModel;

    // @todo This could become a required static method of the model to decouple this module from the models
    //       We would pass in a method to generate a token so the model doesn't implement that.
    //       ex.
    //       AccessToken.createToken( client, user, scope, this.generateToken, done );
    var token = this.generateToken();
    AccessToken.find( {
        token: token
    } ).then( function( results ) {
        if ( results.length ) { // @todo <-- total guess that results.length checks to see if any were found
                                //           need to look at mongoose docs

            // if moved to AccessToken model, this would call AccessToken.createToken instead
            auth.createToken( client, user, scope, done );
            return;
        }
        AccessToken.create( {
            token: token,
            userId: user._id, // @todo with mongoose, can this just be user.id?
            clientId: client.id,
            valid: true
        }, function( err ) {
            if ( err ) {
                return done( err );
            }
            done( null, token );
        } );
    } );
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

    if ( !this._options.accessTokenModel ) {
        throw "AccessToken model must be provided to the auth module.";
    }
    AccessToken = this._options.accessTokenModel;

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
    bcrypt.hash( 'bacon', 8, done );
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
