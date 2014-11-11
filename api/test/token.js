
'use strict';

var mongoose    = require( 'mongoose' ),
    AccessToken = require( '../lib/AccessToken' ),
    accessToken = new AccessToken(),
    tmpId       = mongoose.Types.ObjectId(),
    usr         = {
        '_id':       tmpId,
        'firstName': 'Test',
        'lastName':  'User',
        'email':     'test@example.com'
    },
    tokenVal, createToken, removeToken;

createToken = function ( cacheToken , done ) {
    accessToken.createToken({
            'client': { id: '12345' },
            'user':   usr,
            'scope':  null
        },
        function( err , token ) {
            if ( err ) {
                return done( err );
            }
            if( cacheToken ){
                tokenVal = token;
                done();
            }
            else{
                done( token );
            }
        });
};

suite( 'AccessToken()', function () {

    suiteSetup( function ( done ) {
        return mongoose
            .connect( 'mongodb://localhost/nlmg_test' , done );
    });

    setup( function ( done ) {
        createToken( true , done )
    });

    teardown( function ( done ) {
        accessToken.remove( tokenVal , done );
    });

    suiteTeardown( function ( done ) {
        return mongoose
            .connection
            .db
            .executeDbCommand({
                dropDatabase: 1
            },
            function( err , result ) {
                return mongoose.connection.close( done );
            });
    });

    test( 'insert token into db' , function( done ) {
        accessToken.model
            .findOne({
                'userId': tmpId
            },
            '_id token userId clientId valid',
            function ( err , token ) {
                if( err ){
                    return;
                }

                assert.notEqual( token.count , 0 , 'Token count is not 0' );
                assert.equal( token.token , tokenVal , 'Tokens match' );
                assert.equal( token.userId , tmpId.toString() , 'Token UserId Matches User\'s Id' );

                done();
            });
    });

    // test( 'doesn\'t overwrite token when existing token found', function ( done ) {
    //     // write tests
    //     done();
    // });

    test( 'throws error when max token attempts reached', function ( done ) {
        var spy            = sinon.spy( accessToken , 'createToken' ),
            tokenStub      = sinon.stub( accessToken , 'generateToken' ),
            checkTokenStub = sinon.stub( accessToken , 'tokenCheck' );

        tokenStub.returns( '1725c39691f4b7e6c8dcf82f820125f6bf79238d6a7f85ed9a62aa06601ee841708eaa4eec84b5a552294597bdbe52e2e2db5a9e96dd505b3f23006a3883aae' );
        checkTokenStub.yields( null , false );
        accessToken.ERROR_MAX = 0;

        createToken( false , function ( token ) {

            assert.equal( spy.callCount , accessToken.ERROR_MAX + 1 , 'Create Token Called Max times' );
            assert.instanceOf( token , Error , 'Error Thrown' );

            accessToken.createToken.restore();
            accessToken.generateToken.restore();
            accessToken.tokenCheck.restore();

            done();
        });
    });
});

// 1725c39691f4b7e6c8dcf82f820125f6bf79238d6a7f85ed9a62aa06601ee841708eaa4eec84b5a552294597bdbe52e2e2db5a9e96dd505b3f23006a3883aae
