
'use strict';

var Envelope = require( '../../lib/envelope' ),
    envelope;

suite( 'envelope()', function () {

    suiteSetup( function ( done ){

        envelope = new Envelope();

        done();
    });

    // setup( function ( done ){done();});

    // teardown( function ( done ){done();});

    // suiteTeardown( function ( done ){done();});

    test( 'default envelope returns error', function ( done ) {

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , 400 , 'Meta Code is 400' );
        assert.equal( envelope.meta.errorType , envelope.status_codes[ '400' ].errorType , 'errorType matches default' );
        assert.equal( envelope.meta.errorDetail , envelope.status_codes[ '400' ].details , 'errorDetail matches default' );

        assert.isUndefined( envelope.response , 'Default initial state does not have response' );
        assert.isUndefined( envelope.notifications , 'Default initial state does not have notifications' );

        assert.ok( true , 'Everything is awesome!' );
        done();
    });

    test( 'returns a successful envelope', function ( done ) {
        var code = 200,
            data = { 'success': true };

        envelope.success( code , data );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );
        assert.isObject( envelope.response , 'Envelope Response data is an object!' );

        assert.equal( envelope.meta.code , code , 'envelope meta code matches supplied value of success call' );
        assert.deepEqual( envelope.response , data , 'envelope response deeply equals supplied success call' );

        done();
    });

    test( 'returns a successful envelope, only suppling code', function ( done ) {

        var code = 201,
            data = { 'success': true };

        envelope.success( code );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'envelope meta code matches supplied value of success call' );
        assert.isUndefined( envelope.response , 'Envelope Response data is not defined' );

        done();
    });

    test( 'returns a successful envelope, suppling code - as a string', function ( done ) {

        var code = '202',
            data = { 'success': true };

        envelope.success( code );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'envelope meta code matches supplied value of success call' );
        assert.isUndefined( envelope.response , 'Envelope Response data is not defined' );

        done();
    });

    test( 'returns a successful envelope, only suppling data', function ( done ) {

        var code = 200,
            data = { 'success': true };

        envelope.success( data );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );
        assert.isObject( envelope.response , 'Envelope Response data is an object!' );

        assert.equal( envelope.meta.code , code , 'envelope meta code defaults to 200' );
        assert.deepEqual( envelope.response , data , 'envelope response deeply equals supplied success call' );

        done();
    });

    test( 'returns an error 400 envelope', function ( done ) {
        var code = 400;

        envelope.error( code );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'Meta Code is ' + code );
        assert.equal( envelope.meta.errorType , envelope.status_codes[ code ].errorType , 'errorType matches default' );
        assert.equal( envelope.meta.errorDetail , envelope.status_codes[ code ].details , 'errorDetail matches default' );

        assert.isUndefined( envelope.response , 'error state does not have response' );
        assert.isUndefined( envelope.notifications , 'error state does not have notifications' );

        done();
    });

    test( 'returns an error 401 envelope', function ( done ) {
        var code = 401;

        envelope.error( code );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'Meta Code is ' + code );
        assert.equal( envelope.meta.errorType , envelope.status_codes[ code ].errorType , 'errorType matches default' );
        assert.equal( envelope.meta.errorDetail , envelope.status_codes[ code ].details , 'errorDetail matches default' );

        assert.isUndefined( envelope.response , 'error state does not have response' );
        assert.isUndefined( envelope.notifications , 'error state does not have notifications' );

        done();
    });

    test( 'returns an error 403 envelope', function ( done ) {
        var code = 403;

        envelope.error( code );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'Meta Code is ' + code );
        assert.equal( envelope.meta.errorType , envelope.status_codes[ code ].errorType , 'errorType matches default' );
        assert.equal( envelope.meta.errorDetail , envelope.status_codes[ code ].details , 'errorDetail matches default' );

        assert.isUndefined( envelope.response , 'error state does not have response' );
        assert.isUndefined( envelope.notifications , 'error state does not have notifications' );

        done();
    });

    test( 'returns an error 404 envelope', function ( done ) {
        var code = 404;

        envelope.error( code );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'Meta Code is ' + code );
        assert.equal( envelope.meta.errorType , envelope.status_codes[ code ].errorType , 'errorType matches default' );
        assert.equal( envelope.meta.errorDetail , envelope.status_codes[ code ].details , 'errorDetail matches default' );

        assert.isUndefined( envelope.response , 'error state does not have response' );
        assert.isUndefined( envelope.notifications , 'error state does not have notifications' );

        done();
    });

    test( 'returns an error 405 envelope', function ( done ) {
        var code = 405;

        envelope.error( code );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'Meta Code is ' + code );
        assert.equal( envelope.meta.errorType , envelope.status_codes[ code ].errorType , 'errorType matches default' );
        assert.equal( envelope.meta.errorDetail , envelope.status_codes[ code ].details , 'errorDetail matches default' );

        assert.isUndefined( envelope.response , 'error state does not have response' );
        assert.isUndefined( envelope.notifications , 'error state does not have notifications' );

        done();
    });

    test( 'returns an error 409 envelope', function ( done ) {
        var code = 409;

        envelope.error( code );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'Meta Code is ' + code );
        assert.equal( envelope.meta.errorType , envelope.status_codes[ code ].errorType , 'errorType matches default' );
        assert.equal( envelope.meta.errorDetail , envelope.status_codes[ code ].details , 'errorDetail matches default' );

        assert.isUndefined( envelope.response , 'error state does not have response' );
        assert.isUndefined( envelope.notifications , 'error state does not have notifications' );

        done();
    });

    test( 'returns an error 500 envelope', function ( done ) {
        var code = 500;

        envelope.error( code );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'Meta Code is ' + code );
        assert.equal( envelope.meta.errorType , envelope.status_codes[ code ].errorType , 'errorType matches default' );
        assert.equal( envelope.meta.errorDetail , envelope.status_codes[ code ].details , 'errorDetail matches default' );

        assert.isUndefined( envelope.response , 'error state does not have response' );
        assert.isUndefined( envelope.notifications , 'error state does not have notifications' );

        done();
    });

    test( 'returns a custom error envelope when overriding type/details', function ( done ) {
        var code = 400,
            data = {
                'type':    'errorType copy',
                'details': 'details copy'
            };

        envelope.error( code , data );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'Meta Code is ' + code );
        assert.notEqual( envelope.meta.errorType , envelope.status_codes[ code ].errorType , 'errorType doesn\'t match default' );
        assert.notEqual( envelope.meta.errorDetail , envelope.status_codes[ code ].details , 'errorDetail doesn\'t match default' );

        assert.isUndefined( envelope.response , 'error state does not have response' );
        assert.isUndefined( envelope.notifications , 'error state does not have notifications' );

        done();
    });

    test( 'returns a custom error envelope overriding object, passing no code', function ( done ) {
        var code = 440,
            data = {
                'code':    code,
                'type':    'errorType copy',
                'details': 'details copy'
            };

        envelope.error( data );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'Meta Code is ' + code );
        assert.equal( envelope.meta.errorType , data.type , 'errorType matches overridden value' );
        assert.equal( envelope.meta.errorDetail , data.details , 'errorDetail matches overridden value' );

        assert.isUndefined( envelope.response , 'error state does not have response' );
        assert.isUndefined( envelope.notifications , 'error state does not have notifications' );

        done();
    });

    test( 'returns a custom error envelope', function ( done ) {
        var code = 500;

        envelope.error( code );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'Meta Code is ' + code );
        assert.equal( envelope.meta.errorType , envelope.status_codes[ code ].errorType , 'errorType matches default' );
        assert.equal( envelope.meta.errorDetail , envelope.status_codes[ code ].details , 'errorDetail matches default' );

        assert.isUndefined( envelope.response , 'error state does not have response' );
        assert.isUndefined( envelope.notifications , 'error state does not have notifications' );

        done();
    });


    test( 'appends errors to details', function ( done ) {
        var code = 404,
            data = {
                'type':    'errorType copy',
                'details': 'details details details details',
                'append':  true
            };

        envelope.error( code , data );

        assert.isObject( envelope , 'Envelope is an object.' );
        assert.isObject( envelope.meta , 'Envelope Meta data is an object' );

        assert.equal( envelope.meta.code , code , 'Meta Code is ' + code );
        assert.equal( envelope.meta.errorType , data.type , 'errorType matches supplied data' );
        assert.isArray( envelope.meta.errorDetail , 'errorDetail is an array.' );

        assert.isUndefined( envelope.response , 'error state does not have response' );
        assert.isUndefined( envelope.notifications , 'error state does not have notifications' );

        done();
    });
});
