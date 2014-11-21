
'use strict';

var config;// = require( '../../config' );

suite( 'config()', function (){

    suiteSetup( function ( done ){
        process.env.MONGODB = 'mongodb://localhost/nlmg_test';
        config = require( '../../config' );

        done();
    });

    // setup( function ( done ){done();});

    // teardown( function ( done ){done();});

    // suiteTeardown( function ( done ){done();});

    test( 'define db config', function ( done ) {

        assert.isObject( config.db , 'Database config object is an object' );
        assert.isObject( config.db.options , 'Database config options is an object' );
        assert.isDefined( config.db.uri , 'Database uri is defined' );
        assert.isString( config.db.uri , 'Database uri defined as a string' );

        done();
    });

    test( 'define path to logfile', function ( done ) {

        assert.isDefined( config.logPath , 'Path to log file is defined' );
        assert.isString( config.logPath , 'Path to log file is string' );

        done();
    });

    test( 'define port to run app on', function ( done ) {

        assert.isDefined( config.port , 'Port specified ' );
        assert.isNumber( config.port , 'Port is a number' );

        done();
    });

    test( 'define version prefix to API endpoints', function ( done ) {

        assert.isDefined( config.versionPrefix , 'version prefix specified ' );
        assert.isString( config.versionPrefix , 'version prefix is string' );

        done();
    });

});



