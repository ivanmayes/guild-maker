
'use strict';

var bunyan       = require( 'bunyan' ),
    express      = require( 'express' ),
    Promises     = require( 'bluebird' ),
    mongoose     = Promises.promisifyAll( require( 'mongoose' ) ),
    swaggerize   = require( 'swaggerize-express' ),
    config       = require( './config' ),
    auth         = require( './lib/auth' ),
    expressUtils = require( './lib/express-utils' ),
    routes       = require( './lib/routes' ),
    User         = Promises.promisifyAll( require( './lib/models/user' ) ),
    AccessToken  = Promises.promisifyAll( require( './lib/models/token' ) ),
    app          = express(),
    apiRouter    = express.Router(),
    context, methods, log;

methods = {
    'initLogger': function initLogger () {
        log = global.log = bunyan.createLogger({
            name : 'apiLog',
            streams : [
                {
                    stream: process.stdout
                }
            ]
        });

        return this;
    },
    'connectDB': function connectDB () {
        mongoose.connect( config.db.uri, config.db.options );

        return this;
    },
    'closeDB': function closeDB () {
        mongoose.connection.close();

        return this;
    },
    'handleError': function handleError ( err ) {
        log.info( 'error' , err );
        mongoose.connection.close();
    },
    'initAuth': function initAuth () {

        // Promises.promisifyAll( Object.getPrototypeOf( auth ) );

        auth.options({
            userModel:        User,
            accessTokenModel: AccessToken
        })
        .server();

        return this;
    },
    'initExpress': function initExpress () {

        expressUtils.init( app );

        auth.configureExpress( app );

        // implement routes
        routes( app , apiRouter );

        // app.use( config.versionPrefix, apiRouter );

        // Serves up the swagger spec and docs
        app.use( config.versionPrefix, express.static( __dirname + '/public' ));

        // Seems pretty cool in theory. Gives "Maximum call stack size exceeded" error when I try to run it though.
        // https://github.com/krakenjs/swaggerize-express/issues/38
        // app.use( swaggerize( {
        //     api: require('./api.json'),
        //     docspath: '/docs',
        //     handlers: './lib/routes'
        // } ) );

        app.listen( config.port );
        log.info( 'api on port: %s' , config.port );

        return this;
    }
};

exports = module.exports = (function API () {

    methods
        .initLogger()
        .connectDB()
        .initAuth()
        .initExpress();

}());
