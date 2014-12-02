
'use strict';

var request     = require( 'supertest' ),
    express     = require( 'express' ),
    cors        = require( 'cors' ),
    bodyParser  = require( 'body-parser' ),
    Promises    = require( 'bluebird' ),
    mongoose    = Promises.promisifyAll( require( 'mongoose' ) ),
    config      = require( '../../config' ),
    auth        = require( '../../lib/auth' ),
    route       = require( '../../lib/routes/teams' ),
    app         = express(),
    router      = express.Router(),
    user        = {
        'username':  'foo',
        'firstName': 'Foobar',
        'lastName':  'Barbaz',
        'email':     'foo@bar.baz'
    },
    authStub;

suite( 'Team Routes', function () {

    suiteSetup( function ( done ){

        authStub = sinon.stub( auth , 'requireUser' , function ( req , res , next ) {
            req.user = user;
            return next();
        });

        mongoose.connect( 'mongodb://localhost/nlmg_test' , config.db.options );

        app.use(bodyParser.urlencoded({ extended: true }));

        // parse application/json
        app.use(bodyParser.json());

        // parse plain text
        app.use(bodyParser.text());

        // parse various different custom JSON types as JSON
        app.use(bodyParser.json({ type: 'application/*+json' }));

        app.use( '/' , router );

        route( router );

        done();
    });

    // setup( function ( done ){done();});

    // teardown( function ( done ){done();});

    suiteTeardown( function ( done ){
        auth.requireUser.restore();

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

    test( 'GET /teams' , function ( done ) {

        request( app )
            .get( '/teams' )
            .expect( function( res ) {
                assert.equal( res.status , 200 , 'response has a status code of 200.');
                assert.isObject( res.body , 'response body is object' );
                assert.isObject( res.body.meta , 'response body.meta is object' );
                assert.equal( res.body.meta.code , 200 , 'response meta code is 200.');
                assert.isArray( res.body.response , 'response body.response is object' );
            })
            .end( function( err , res ){
                if ( err ) {
                    return done( err );
                }
                done();
            });
    });

/*
    test( 'GET /teams/search' , function ( done ) {

        request( app )
            .get( '/teams/search' )
            .expect( function( res ) {
                assert.equal( res.status , 200 , 'response has a status code of 200.');
                assert.isObject( res.body , 'response body is object' );
                assert.isObject( res.body.meta , 'response body.meta is object' );
                assert.equal( res.body.meta.code , 200 , 'response meta code is 200.');
                assert.isObject( res.body.response , 'response body.response is object' );
            })
            .end( function( err , res ){
                if ( err ) {
                    return done( err );
                }
                done();
            });
    });

    test( 'GET /teams/follow/:teamId?' , function ( done ) {

        request( app )
            .get( '/teams/follow/:teamId?' )
            .expect( function( res ) {
                assert.equal( res.status , 200 , 'response has a status code of 200.');
                assert.isObject( res.body , 'response body is object' );
                assert.isObject( res.body.meta , 'response body.meta is object' );
                assert.equal( res.body.meta.code , 200 , 'response meta code is 200.');
                assert.isObject( res.body.response , 'response body.response is object' );
            })
            .end( function( err , res ){
                if ( err ) {
                    return done( err );
                }
                done();
            });
    });

    test( 'GET /teams/unfollow/:teamId?' , function ( done ) {

        request( app )
            .get( '/teams/unfollow/:teamId?' )
            .expect( function( res ) {
                assert.equal( res.status , 200 , 'response has a status code of 200.');
                assert.isObject( res.body , 'response body is object' );
                assert.isObject( res.body.meta , 'response body.meta is object' );
                assert.equal( res.body.meta.code , 200 , 'response meta code is 200.');
                assert.isObject( res.body.response , 'response body.response is object' );
            })
            .end( function( err , res ){
                if ( err ) {
                    return done( err );
                }
                done();
            });
    });
//*/

    test( 'GET /teams/:teamId' , function ( done ) {

        // we expect failure because we're using a testing db
        // that hasn't been seeded
        request( app )
            .get( '/teams/000' )
            .expect( function( res ) {
                console.log( res.body );
                assert.equal( res.status , 200 , 'response has a status code of 200.');
                assert.isObject( res.body , 'response body is object' );
                assert.isObject( res.body.meta , 'response body.meta is object' );
                assert.equal( res.body.meta.code , 500 , 'response meta code is 500.');
                // assert.isObject( res.body.response , 'response body.response is object' );
            })
            .end( function( err , res ){
                if ( err ) {
                    return done( err );
                }
                done();
            });
    });

});
