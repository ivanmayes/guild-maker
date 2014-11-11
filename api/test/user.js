
'use strict';

var mongoose = require( 'mongoose' ),
    User     = require( '../lib/models/User' ),
    usr      = {
        'firstName': 'Test',
        'lastName':  'User',
        'email':     'test@example.com'
    };

// suite( 'index', function() {
//     test( 'index is good' , function ( done ) {
//         assert.ok( 'something' , 'something is ok.' );

//         done();
//     });
// });

suite( 'User()', function () {

    suiteSetup( function ( done ) {
        return mongoose
            .connect( 'mongodb://localhost/nlmg_test' , done );
    });

    setup( function ( done ) {
        User.create( usr , done );
    });

    teardown( function ( done ) {
        User.remove(
            {
                email: usr.email
            },
            done
        );
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


    test( 'insert user into db' , function( done ) {
        User.findOne({
            'email': usr.email
        },
        '_id firstName lastName email',
        function ( err , user ) {
            if( err ){
                return;
            }
            // console.log( user );
            assert.notEqual( user.count , 0 , 'Model count is not 0' );
            assert.equal( user.firstName , usr.firstName , 'First Name matches' );
            assert.equal( user.lastName , usr.lastName , 'First Name matches' );
            assert.equal( user.email , usr.email , 'First Name matches' );

            done();
        });
    });
});
