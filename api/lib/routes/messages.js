
'use strict';

var Envelope   = require( '../envelope' ),
    routeUtils = require( '../route-utils' ),
    Message    = require( '../models/message' ),
    envelope;

exports = module.exports = function MessageRoutes( auth , router ) {

    // get list of all messages
    router.get( '/messages', auth.requireUser , function( req , res , next ) {
        envelope = new Envelope();

        Message.findAsync({})
            .then( function ( messages ) {
                envelope.success( 200 , messages );
                res.json( envelope );
                return;
            })
            .catch( function ( err ) {
                envelope.error( 500 , {
                    'details': 'The server returned an error finding all messages.',
                    'append':  true
                });
                res.json( envelope );
                return;
            });
    });
    /*
    // get list of all messages
    router.get( '/messages', auth.requireUser , function( req , res , next ) {
        envelope = new Envelope();

        Message.findAsync({})
            .then( function ( messages ) {
                envelope.success( 200 , messages );
                res.json( envelope );
                return;
            })
            .catch( function ( err ) {
                envelope.error( 500 , {
                    'details': 'The server returned an error finding all messages.',
                    'append':  true
                });
                res.json( envelope );
                return;
            });
    });
    */

    router.get( '/messages/search', auth.requireUser , function( req , res , next ) {
        var keys, query;

        envelope = new Envelope();

        // cache members of model.
        keys = routeUtils.findModelMembers( Message );

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

        Message
            .findAsync( query )
                .then( function ( messages ) {
                    envelope.success( 200 , messages );
                    res.json( envelope );
                    return;
                })
                .catch( function ( err ) {
                    envelope.error( 500 , {
                        'details': 'The server returned an error finding messages matching supplied arguments.',
                        'append':  true
                    });
                    res.json( envelope );
                    return;
                });
        return;
    });

    router.get( '/messages/:messageId', auth.requireUser , function( req , res , next ) {
        var messageId = req.params.messageId;
        envelope = new Envelope();

        if( !messageId ){
            // no messageId present, return error envelope
            envelope.error( 400 , {
                'details': 'Missing Message Id.',
                'append':  true
            });
            res.json( envelope );
            return;
        }

        Message.findOneAsync({
            '_id': messageId
        })
        .then( function ( message ) {
            envelope.success( 200 , message );
            res.json( envelope );
            return;
        })
        .catch( function ( err ) {
            envelope.error( 500 , {
                'details': 'The server returned an error finding a message matching supplied id.',
                'append':  true
            });
            res.json( envelope );
            return;
        });
    });
};
