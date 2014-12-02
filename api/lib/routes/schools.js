
'use strict';

var validator   = require( 'validator' ),
    Promises    = require( 'bluebird' ),
    Envelope    = require( '../envelope' ),
    auth        = require( '../auth' ),
    routeUtils  = require( '../route-utils' ),
    School      = require( '../models/school' ),
    envelope;


exports = module.exports = function SchoolRoutes( router ) {

    // get list of all schools
    router.get( '/schools', auth.requireUser , function( req , res , next ) {
        envelope = new Envelope();

        School.findAsync({})
            .then( function ( schools ) {
                envelope.success( 200 , schools );
                res.json( envelope );
                return;
            })
            .catch( function ( err ) {
                envelope.error( 500 , {
                    'details': 'The server returned an error finding all schools.',
                    'append':  true
                });
                res.json( envelope );
                return;
            });
    });

    router.get( '/schools/search', auth.requireUser , function( req , res , next ) {
        var keys, query;

        envelope = new Envelope();

        // cache members of model.
        keys = routeUtils.findModelMembers( School );

        // obtain query schema
        query = routeUtils.getSearchQuery({
            'keys':  keys,
            'query': req.query
        });

        if( !query ){
            // after parsing, no valid query present...
            // send error envelope and bail
            envelope.error( 400 , {
                'details': 'Missing search parameters.',
                'append':  true
            });
            res.json( envelope );
            return;
        }

        School
            .findAsync( query )
                .then( function ( schools ) {
                    envelope.success( 200 , schools );
                    res.json( envelope );
                    return;
                })
                .catch( function ( err ) {
                    envelope.error( 500 , {
                        'details': 'The server returned an error finding schools matching supplied arguments.',
                        'append':  true
                    });
                    res.json( envelope );
                    return;
                });
        return;
    });

    router.get( '/schools/:schoolId', auth.requireUser , function( req , res , next ) {
        var schoolId = req.params.schoolId;
        envelope = new Envelope();

        if( !schoolId ){
            // no schoolId present, return error envelope
            envelope.error( 400 , {
                'details': 'Missing School Id.',
                'append':  true
            });
            res.json( envelope );
            return;
        }

        School.findOneAsync({
            '_id': schoolId
        })
        .then( function ( team ) {
            envelope.success( 200 , team );
            res.json( envelope );
            return;
        })
        .catch( function ( err ) {
            envelope.error( 500 , {
                'details': 'The server returned an error finding a school matching supplied id.',
                'append':  true
            });
            res.json( envelope );
            return;
        });
    });

};
