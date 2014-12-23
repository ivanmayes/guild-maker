
'use strict';

var validator  = require( 'validator' ),
    Envelope   = require( '../envelope' ),
    routeUtils = require( '../route-utils' ),
    Message    = require( '../models/message' ),
    envelope;

exports = module.exports = function MessageRoutes( auth , router ) {

    // get list of all messages
    router.get( '/messages', auth.requireUser , function( req , res , next ) {
        var audience = req.query.audience || '',
            since    = req.query.since || 0,
            limit    = req.query.limit,
            findData, query;

        envelope = new Envelope();

        if( audience.length > 0 ) {
            audience = audience.split( ',' );
            // audience supplied, find messages by audience
            query = { 'audience': { '$in': audience } };
        }

        // if since is a valid integer (epoch),
        if( validator.isInt( since ) ){
            findData = {
                query: query,
                limit: limit,
                since: since
            };
        }
        else{
            findData = {
                query: query,
                limit: limit
            };
        }

        routeUtils.getMessages( findData )
            .then( function ( messages ) {
                envelope.success( 200 , messages );
                res.json( envelope );
                return;
            })
            .catch( function ( err ) {
                envelope.error( 500 , {
                    'details': 'The server returned an error finding messages.',
                    'append':  true
                });
                res.json( envelope );
                return;
            });
        return;
    });

    router.get( '/messages/search', auth.requireUser , function( req , res , next ) {
        var since   = req.query.since || 0,
            limit   = req.query.limit,
            findData, keys, query, queryData;

        envelope = new Envelope();

        // cache members of model.
        keys = routeUtils.findModelMembers( Message );

        // obtain query schema
        queryData = routeUtils.getSearchQuery({
            'keys':  keys,
            'query': req.query
        });

        if( !queryData ){
            // after parsing, no valid query present...
            // send error envelope and bail
            envelope.error( 400 , {
                'details': 'Missing search parameters.',
                'append':  true
            });
            res.json( envelope );
            return;
        }

        // if since is a valid integer (epoch),
        if( validator.isInt( since ) ){
            findData = {
                query: queryData,
                limit: limit,
                since: since
            };
        }
        else{
            findData = {
                query: queryData,
                limit: limit
            };
        }

        routeUtils.getMessages( findData )
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
