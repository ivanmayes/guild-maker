
'use strict';

var mongoose = require( 'mongoose' ),
    User     = require( '../../lib/models/user' ),
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
        var findUsers = function () {
            User.findOne({
                'email': usr.email
            },
            '_id firstName lastName email',
            function ( err , user ) {
                if( err ){
                    return;
                }
                assert.equal( user.firstName , usr.firstName , 'First Name matches' );
                assert.equal( user.lastName , usr.lastName , 'Last Name matches' );
                assert.equal( user.email , usr.email , 'Email Name matches' );

                done();
            });
        };

        User.count({
            'email': usr.email
        },
        function ( err , count ) {
            assert.notEqual( count , 0 , 'Model count is not 0' );
            assert.equal( count , 1 , 'Model count is 1' );
            findUsers();
        });
    });
});
