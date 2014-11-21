
'use strict';

var bunyan = require( 'bunyan' ),
    log    = global.log = bunyan.createLogger( {
    name : 'apiLog' ,
    streams : [
        /*{
            path : config.logPath
            // `type: 'file'` is implied
        },*/
        {
            stream: process.stdout
        }
    ]
} );

var childProcess   = require( 'child_process' ),
    path           = require( 'path' ),
    express        = require( 'express' ),
    cors           = require( 'cors' ),
    swaggerize     = require('swaggerize-express'),
    passport       = require( 'passport' ),
    BearerStrategy = require( 'passport-http-bearer' ).Strategy,
    // Only going to return json
    // cons           = require( 'consolidate' ),
    mongoose       = require( 'mongoose' ),
    config         = require( './config' ),
    expressUtils   = require( './lib/express-utils' ),
    auth           = require( './lib/auth' ),
    AccessToken    = require( './lib/access-token' ),
    User           = require( './lib/models/user' ),
    accessToken    = new AccessToken(),
    app            = express(),
    apiRouter      = express.Router(),
    testUser, httpServer;

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

    expressUtils.init( app );

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
        // curl -d "userName=Test&firstName=Test&lastName=User&email=test%40example.com&password=password" http://127.0.0.1:3000/v1/signup

        auth.hashPassword( req.body.password , function ( err , hash ) {
            if( err ){
                handleError( err );
                return;
            }

            User.create(
                {
                    'userName':  req.body.userName,
                    'firstName': req.body.firstName,
                    'lastName':  req.body.lastName,
                    'email':     req.body.email,
                    'password':  hash
                },
                function ( err , user ) {
                    accessToken.createToken({
                        'client': { id: 'Shoptology.wut.wut' },
                        'user':   user,
                        'scope':  null
                    },
                    function( err , token ) {
                        if ( err ) {
                            res.json( {
                                meta: {
                                    code: 400,
                                    errorType: 'server_error',
                                    errorDetail: "The server returned an error creating a token for userId: " + user._id.toString() + "."
                                }
                            } );
                        }
                        res.json( {
                            meta: { code: 200 },
                            response: {
                                firstName: user.firstName,
                                lastName:  user.lastName,
                                name:      user.name,
                                email:     user.email,
                                token:     token
                            }
                        } );
                    });
                });
        });

    } );

    apiRouter.post( '/login', function( req , res ) {
        // curl -d "email=test%40example.com&password=password" http://127.0.0.1:3000/v1/login
        var testString;

        // log.info( '?!!?:' , req.body , req.password );

        // client, username, password, scope, done
        auth.exchangePassword(
            { id: 'Shoptology.wut.wut' },
            req.body.email,
            req.body.password,
            null,
            function ( err , token ) {

                log.info( '?!!?:' , err , token );

                if ( err ) {
                    res.json( {
                        meta: {
                            code: 400,
                            errorType: 'server_error',
                            errorDetail: "The server returned an error exchanging a password for a token."
                        }
                    } );
                    return;
                }

                if ( !token ) {
                    res.json( {
                        meta: {
                            code: 401,
                            errorType: 'invalid_auth',
                            errorDetail: "OAuth token was not provided or was invalid."
                        }
                    } );
                    return;
                }

                res.json( {
                    meta: { code: 200 },
                    response: {
                        token:     token
                    }
                } );
            }
        );

        // @ todo create something that calls auth.exchangePassword
    });

    app.use( config.versionPrefix, apiRouter );

    // Serves up the swagger spec and docs
    app.use( config.versionPrefix, express.static( __dirname + '/public' ));

    // Seems pretty cool in theory. Gives "Maximum call stack size exceeded" error when I try to run it though.
    // https://github.com/krakenjs/swaggerize-express/issues/38
    // app.use( swaggerize( {
    //     api: require('./api.json'),
    //     docspath: '/docs',
    //     handlers: './lib/routes'
    // } ) );

    httpServer = app.listen( config.port );
    log.info( 'api on port: %s' , config.port );
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
            testString = 'http://127.0.0.1:' + config.port + '/v1/me?access_token=' + token;

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
    configureExpressServer();
    // createUser( testUser )
    //     .then( createToken , handleError );
        // .then( stop );
};

exports = module.exports = ( function () {

    // connect to db
    connectDB();

    auth.hashPassword( 'password' , function ( err , hash ) {
        if( err ){
            handleError( err );
            return;
        }

        testUser = {
            'name':      'Test',
            'firstName': 'Test',
            'lastName':  'User',
            'email':     'test@example.com',
            'password':  hash
        };

        // console.log( testUser );


        initialize();
    });



    // // connect to db
    // connectDB();
    // // clean up previous tests
    // cleanup(
    //     {
    //         token: null,
    //         email: testUser.email
    //     },
    //     initialize
    // );

}());


