
var EventEmitter = require( 'events' ).EventEmitter,
    hat          = require( 'hat' ),
    AccessTokens = require( './models/AccessTokens' ),
    oauth2orize  = require( 'oauth2orize' );

module.exports = exports = new Auth();

exports.Auth = Auth;

function Auth() {
    this._server = null;
}

Auth.prototype.__proto__ = EventEmitter.prototype;

Auth.prototype.server = function server() {
    if ( !this._server ) {
        this._server = oauth2orize.createServer();
        this._configureServer( this._server );
    }
    return this._server;
};

Auth.prototype._configureServer = function _configureServer( server ) {
    server.grant(oauth2orize.grant.token(function(client, user, ares, done) {
        var token = hat(512, 16);

        AccessTokens.save( {
            token: token, // @todo need to check for collisions
            userId: user._id,
            clientId: '12345'
        }, function(err) {
            if (err) {
                return done( err );
            }
            done( null, token );
        });
    }));
};
