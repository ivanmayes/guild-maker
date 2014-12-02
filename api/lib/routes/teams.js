
'use strict';

var validator   = require( 'validator' ),
    Promises    = require( 'bluebird' ),
    Envelope    = require( '../envelope' ),
    auth        = require( '../auth' ),
    routeUtils  = require( '../route-utils' ),
    Team        = require( '../models/team' ),
    envelope;

exports = module.exports = function TeamRoutes( router ) {
    // router.get( '/teams/:required/:optional?*', auth.requireUser , function( req , res , next ) {

    // get list of all teams
    router.get( '/teams', auth.requireUser , function( req , res , next ) {
        envelope = new Envelope();

        Team.findAsync({})
            .then( function ( teams ) {
                envelope.success( 200 , teams );
                res.json( envelope );
                return;
            })
            .catch( function ( err ) {
                envelope.error( 500 , {
                    'details': 'The server returned an error finding all teams.',
                    'append':  true
                });
                res.json( envelope );
                return;
            });
    });

    // get team(s) by search terms:
    router.get( '/teams/search', auth.requireUser , function( req , res , next ) {
        var keys, query;

        envelope = new Envelope();

        // cache members of model.
        keys = routeUtils.findModelMembers( Team );

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

        Team.findAsync( query )
            .then( function ( teams ) {
                envelope.success( 200 , teams );
                res.json( envelope );
                return;
            })
            .catch( function ( err ) {
                envelope.error( 500 , {
                    'details': 'The server returned an error finding teams matching supplied arguments.',
                    'append':  true
                });
                res.json( envelope );
                return;
            });

        return;
    });

    // follow team
    router.get( '/teams/follow/:teamId?', auth.requireUser , function( req , res , next ) {
        var teamId = req.params.teamId;

        envelope = new Envelope();

        if( !teamId ){
            // no teamId present, return error envelope
            envelope.error( 400 , {
                'details': 'Missing Team Id.',
                'append':  true
            });
            res.json( envelope );
            return;
        }

        Team.findOneAsync({
            '_id': teamId
        })
        .then( function ( team ) {
            var teamIndex = req.user.followedTeams.indexOf( team._id.toString() );

            if( teamIndex < 0 ){
                req.user.followedTeams.push( team._id.toString() );
                return req.user.saveAsync();
            }
            else{
                envelope.success( 200 );
                res.json( envelope );
                return;
            }

        })
        .spread( function( savedUser , numAffected ) {
            if( numAffected < 1 ){
                throw new Error( 'Error updating User\'s lastVisitTime.' );
            }

            envelope.success( 200 , savedUser );
            res.json( envelope );
            return;
        })
        .catch( function ( err ) {
            envelope.error( 500 , {
                'details': 'The server returned an error finding a team matching supplied id.',
                'append':  true
            });
            res.json( envelope );
            return;
        });
    });

    // unfollow team
    router.get( '/teams/unfollow/:teamId?', auth.requireUser , function( req , res , next ) {
        var teamId = req.params.teamId;
        envelope = new Envelope();

        if( !teamId ){
            // no teamId present, return error envelope
            envelope.error( 400 , {
                'details': 'Missing Team Id.',
                'append':  true
            });
            res.json( envelope );
            return;
        }

        Team.findOneAsync({
            '_id': teamId
        })
        .then( function ( team ) {
            var teamIndex = req.user.followedTeams.indexOf( team._id.toString() );

            if( teamIndex >= 0 ){
                req.user.followedTeams.splice( teamIndex , 1 );
            }

            return req.user.saveAsync();
        })
        .spread( function( savedUser , numAffected ) {
            if( numAffected < 1 ){
                throw new Error( 'Error updating User\'s lastVisitTime.' );
            }

            envelope.success( 200 , savedUser );
            res.json( envelope );
            return;
        })
        .catch( function ( err ) {
            envelope.error( 500 , {
                'details': 'The server returned an error finding a team matching supplied id.',
                'append':  true
            });
            res.json( envelope );
            return;
        });
    });

    // get individual team by teamId
    router.get( '/teams/:teamId', auth.requireUser , function( req , res , next ) {
        var teamId = req.params.teamId;
        envelope = new Envelope();

        if( !teamId ){
            // no teamId present, return error envelope
            envelope.error( 400 , {
                'details': 'Missing Team Id.',
                'append':  true
            });
            res.json( envelope );
            return;
        }

        Team.findOneAsync({
            '_id': teamId
        })
        .then( function ( team ) {
            envelope.success( 200 , team );
            res.json( envelope );
            return;
        })
        .catch( function ( err ) {
            envelope.error( 500 , {
                'details': 'The server returned an error finding a team matching supplied id.',
                'append':  true
            });
            res.json( envelope );
            return;
        });
    });
};
