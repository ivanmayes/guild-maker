
'use strict';

var validator   = require( 'validator' ),
    Envelope    = require( '../envelope' ),
    routeUtils  = require( '../route-utils' ),
    Events      = require( '../models/event' ),
    envelope;

exports = module.exports = function EventRoutes( auth , router ) {
    // route code here.

    router.get( '/events', auth.requireUser , function( req , res , next ) {
        envelope = new Envelope();

        Events.findAsync({})
            .then( function ( schools ) {
                envelope.success( 200 , schools );
                res.json( envelope );
                return;
            })
            .catch( function ( err ) {
                envelope.error( 500 , {
                    'details': 'The server returned an error finding all events.',
                    'append':  true
                });
                res.json( envelope );
                return;
            });
    });

    router.get( '/events/search', auth.requireUser , function( req , res , next ) {
        var keys, query;

        envelope = new Envelope();

        // cache members of model.
        keys = routeUtils.findModelMembers( Events );

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

        Events
            .findAsync( query )
                .then( function ( events ) {
                    envelope.success( 200 , events );
                    res.json( envelope );
                    return;
                })
                .catch( function ( err ) {
                    envelope.error( 500 , {
                        'details': 'The server returned an error finding events matching supplied arguments.',
                        'append':  true
                    });
                    res.json( envelope );
                    return;
                });
        return;
    });

    router.get( '/events/:eventId', auth.requireUser , function( req , res , next ) {
        var eventId = req.params.eventId;
        envelope = new Envelope();

        if( !eventId ){
            // no eventId present, return error envelope
            envelope.error( 400 , {
                'details': 'Missing Events Id.',
                'append':  true
            });
            res.json( envelope );
            return;
        }

        Events.findOneAsync({
            '_id': eventId
        })
        .then( function ( event ) {
            envelope.success( 200 , event );
            res.json( envelope );
            return;
        })
        .catch( function ( err ) {
            envelope.error( 500 , {
                'details': 'The server returned an error finding an event matching supplied id.',
                'append':  true
            });
            res.json( envelope );
            return;
        });
    });
};
