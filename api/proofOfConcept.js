
'use strict';

var childProcess   = require( 'child_process' ),
    path           = require( 'path' ),
    express        = require( 'express' ),
    passport       = require( 'passport' ),
    BearerStrategy = require( 'passport-http-bearer' ).Strategy,
    bunyan         = require( 'bunyan' ),
    // Only going to return json
    // cons           = require( 'consolidate' ),
    mongoose       = require( 'mongoose' ),
    config         = require( './config' ),
    auth           = require( './lib/auth' ),
    AccessToken    = require( './lib/access-token' ),
    User           = require( './lib/models/user' ),
    accessToken    = new AccessToken(),
    app            = express(),
    apiRouter      = express.Router(),
    testUser       = {
        'firstName': 'Test',
        'lastName':  'User',
        'email':     'test@example.com'
    },
    httpServer;

var log = bunyan.createLogger( {
    name : 'apiLog' ,
    streams : [
        {
            path : config.logPath
            // `type: 'file'` is implied
        },
        {
            stream: process.stdout
        }
    ]
} );

var pbcopy = function pbcopy( data ) {
    var proc = childProcess.spawn( 'pbcopy' );

    proc.stdin.write( data );

    proc.on( 'close' , function ( code ) {
        log.info( '::: copied to Clipboard (OS X):\n%s\n:::\n' , data );
    });
    proc.stdin.end();
};

var handleError = function handleError ( err ) {
    log.info( 'error' , err );
    mongoose.connection.close();
};

var connectDB = function connectDB () {
    mongoose.connect( config.db.uri, config.db.options );
};

var configureAuthServer = function configureAuthServer () {

    auth.options({
        userModel: User,
        accessToken: accessToken
    })
    .server();
};

var configureExpressServer = function configureExpressServer () {
    log.info("hi");
    auth.configureExpress( app );

    // curl -v http://localhost:3000/foo?access_token=[token]
    apiRouter.get( '/me', auth.requireUser, function( req , res , next ) {
        res.json( {
            meta: { code: 200 },
            response: {
                firstName: req.user.firstName,
                lastName:  req.user.lastName,
                email:     req.user.email
            }
        } );
    });

    apiRouter.post( '/signup', function( req , res ) {
        // @todo create something that creates a new user and returns an access token
    } );

    apiRouter.post( '/login', function( req , res ) {
        // @todo create something that calls auth.exchangePassword
    } );

    app.use( config.versionPrefix, apiRouter );

    httpServer = app.listen( config.port );
};

var cleanup = function cleanup ( options , done ) {
    var opts = options || {};

    User.remove(
        {
            email: opts.email
        },
        function ( err ) {
            if ( err ) {
                handleError( err );
                return;
            }

            accessToken.remove( opts.token , done );
        }
    );
};

var createUser = function createUser ( user ) {
    return User.create( user );
};

var createToken = function createToken ( user ) {
    var testString;

    auth.createToken(
        {
            id: '0987654'
        },
        user,
        null,
        function ( err , token ) {

            if( err ){
                handleError( err );
                return;
            }

            // testString = 'curl -v http://127.0.0.1:3000/foo?access_token=' + token;
            testString = 'http://127.0.0.1:3000/v1/me?access_token=' + token;

            pbcopy( testString );

            // configure express server
            configureExpressServer();
        }
    );
};

var stop = function stop () {
    mongoose.connection.close();
    httpServer.close();
};

var initialize = function initialize ( err ) {
    // return if error
    if ( err ) {
        return handleError();
    }

    configureAuthServer();

    createUser( testUser )
        .then( createToken , handleError );
        // .then( stop );
};

exports = module.exports = ( function () {

    // connect to db
    connectDB();

    // clean up previous tests
    cleanup(
        {
            token: null,
            email: testUser.email
        },
        initialize
    );

}());


