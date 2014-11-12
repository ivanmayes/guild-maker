
'use strict';

var childProcess   = require( 'child_process' ),
    express        = require( 'express' ),
    passport       = require( 'passport' ),
    BearerStrategy = require( 'passport-http-bearer' ).Strategy,
    mongoose       = require( 'mongoose' ),
    config         = require( './config' ),
    Auth           = require( './lib/auth.js' ),
    AccessToken    = require( './lib/AccessToken.js' ),
    User           = require( './lib/models/User.js' ),
    accessToken    = new AccessToken(),
    app            = express(),
    testUser       = {
        'firstName': 'Test',
        'lastName':  'User',
        'email':     'test@example.com'
    },
    httpServer;

var pbcopy = function pbcopy( data ) {
    var proc = childProcess.spawn( 'pbcopy' );

    proc.stdin.write( data );

    proc.on( 'close' , function ( code ) {
        console.log( '::: copied to Clipboard (OS X):\n%s\n:::\n' , data );
    });
    proc.stdin.end();
};

var handleError = function handleError ( err ) {
    console.log( 'error' , err );
    mongoose.connection.close();
};

var connectDB = function connectDB () {
    mongoose.connect( config.db.uri, config.db.options );
};

var configureAuthServer = function configureAuthServer () {

    Auth.options({
        userModel: User,
        accessToken: accessToken
    })
    .server();
};

var configureExpressServer = function configureExpressServer () {

    app.use( passport.initialize() );

    passport.use( new BearerStrategy(
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
    ));

    // curl -v http://localhost:3000/foo?access_token=[token]
    app.get(
        '/foo',
        // Authenticate using HTTP Bearer credentials, with session support disabled.
        passport.authenticate(
            'bearer',
            {
                session:         false,
                failureRedirect: '/login'
            }
        ),
        function( req , res , next ){
            res.json({
                firstName: req.user.firstName,
                lastName:  req.user.lastName,
                email:     req.user.email
            });
        }
    );

    httpServer = app.listen( 3000 );
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

    Auth.createToken(
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

            testString = 'curl -v http://127.0.0.1:3000/foo?access_token=' + token;

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
