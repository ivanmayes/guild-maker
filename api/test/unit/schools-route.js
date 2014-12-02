
'use strict';

var request     = require( 'supertest' ),
    express     = require( 'express' ),
    cors        = require( 'cors' ),
    bodyParser  = require( 'body-parser' ),
    Promises    = require( 'bluebird' ),
    mongoose    = Promises.promisifyAll( require( 'mongoose' ) ),
    config      = require( '../../config' ),
    auth        = require( '../../lib/auth' ),
    route       = require( '../../lib/routes/schools' ),
    app         = express(),
    router      = express.Router(),
    user        = {
        'username':  'foo',
        'firstName': 'Foobar',
        'lastName':  'Barbaz',
        'email':     'foo@bar.baz'
    },
    authStub;

suite( 'School Routes', function () {

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

    test( 'GET /schools' , function ( done ) {

        request( app )
            .get( '/schools' )
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
    test( 'GET /schools/search' , function ( done ) {
    });
*/

    test( 'GET /schools/:schoolId' , function ( done ) {
        // we expect failure because we're using a testing db
        // that hasn't been seeded
        request( app )
            .get( '/schools/000' )
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
