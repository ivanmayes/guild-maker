
'use strict';

var validator  = require( 'validator' ),
    Envelope   = require( '../envelope' ),
    routeUtils = require( '../route-utils' ),
    Message    = require( '../models/message' ),
    minLimit   = 50,
    // TODO: implement max, currently not in use.
    // maxLimit   = 500,
    envelope;

exports = module.exports = function MessageRoutes( auth , router ) {

    // get list of all messages
    router.get( '/messages', auth.requireUser , function( req , res , next ) {
        var audience = req.query.audience || '',
            since    = req.query.since || 0,
            limit    = req.query.limit || minLimit,
            sortObj  = {
                'publishTime': -1
            },
            queryObj = {},
            queryReq;

        envelope = new Envelope();

        if( audience.length > 0 ) {
            audience = audience.split( ',' );
            // audience supplied, find messages by audience
            queryObj = { 'audience': { '$in': audience } };
        }

        console.log( audience, queryObj );

        queryReq = Message.find( queryObj );

        if( since !== 0 ) {
            // time contraint
            if( validator.isInt( since ) ){
                queryReq = queryReq.where( 'publishTime' ).gt( new Date( since ) );
            }
        }

        console.log( limit , '??!?!' );

        queryReq
            .sort( sortObj )
            .limit( limit )
            .execAsync()
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
            limit   = req.query.limit || minLimit,
            sortObj = {
                'publishTime': -1
            },
            keys, query, queryData;

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

        query = Message.find( queryData );

        if( since !== 0 ) {
            // time contraint
            if( validator.isInt( since ) ){
                query = query.where( 'publishTime' ).gt( new Date( since ) );
            }
        }

        query
            .sort( sortObj )
            .limit( limit )
            .execAsync()
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
