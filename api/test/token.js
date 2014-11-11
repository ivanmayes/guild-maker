
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
    tokenVal;

suite( 'AccessToken()', function () {

    suiteSetup( function ( done ) {
        return mongoose
            .connect( 'mongodb://localhost/nlmg_test' , done );
    });

    setup( function ( done ) {
        accessToken.createToken({
            'client': { id: '12345' },
            'user':   usr,
            'scope':  null
        },
        function( err , token ) {
            if ( err ) {
                return done( err );
            }
            tokenVal = token;
            done();
        });
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
});
