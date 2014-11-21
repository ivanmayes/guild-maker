
'use strict';

var utils         = require( '../../lib/express-utils' ),
    bodyParserSpy = sinon.spy( utils , 'bodyParser' ),
    corsSpy       = sinon.spy( utils , 'cors' ),
    initSpy       = sinon.spy( utils , 'init' ),
    trustProxySpy = sinon.spy( utils , 'trustProxy' );

suite( 'express-utils()', function () {

    suiteSetup( function ( done ){
        utils.init({
            'use':    function() {},
            'enable': function() {}
        });

        done();
    });

    // setup( function ( done ){done();});

    // teardown( function ( done ){done();});

    suiteTeardown( function ( done ){
        utils.bodyParser.restore();
        utils.cors.restore();
        utils.init.restore();
        utils.trustProxy.restore();

        done();
    });

    test( 'bodyParser' , function ( done ) {
        assert.equal( bodyParserSpy.callCount , 1 , 'bodyParser called once' );
        done();
    });

    test( 'cors' , function ( done ) {
        assert.equal( corsSpy.callCount , 1 , 'cors called once' );
        done();
    });

    test( 'init' , function ( done ) {
        assert.equal( initSpy.callCount , 1 , 'init called once' );
        done();
    });

    test( 'trustProxy' , function ( done ) {
        assert.equal( trustProxySpy.callCount , 1 , 'trustProxy called once' );
        done();
    });

});
