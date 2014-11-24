
'use strict';

var validator   = require( 'validator' ),
    Promises    = require( 'bluebird' ),
    Envelope    = require( '../envelope' ),
    auth        = require( '../auth' ),
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
        // TODO: validate query is supplied, and get schoolId query to work
        var query, keys, key, param;

        keys     = [];
        query    = {};
        envelope = new Envelope();

        // cache members of model.
        for( key in Team.schema.paths ){
            if( Team.schema.paths.hasOwnProperty( key ) ){
                keys.push( key );
            }
        }

        for( param in req.query ) {
            if( param === 'access_token' ){
                break;
            }

            if( keys.indexOf( param ) >= 0 ) {
                query[ param ] = req.query[ param ];
            }

        }

        console.log( query , '~!');
        Team.findAsync( query )
            .then( function ( teams ) {
                envelope.success( 200 , teams );
                res.json( envelope );
                return;
            })
            .catch( function ( err ) {
                envelope.error( 500 , {
                    'details': 'The server returned an error finding teams mathcing supplied arguments.',
                    'append':  true
                });
                res.json( envelope );
                return;
            });

        return;
    });

    // get individual team by teamId
    router.get( '/teams/:teamId', auth.requireUser , function( req , res , next ) {
        // TODO: validate team Id is supplied
        var teamId = req.params.teamId || 0;
        envelope = new Envelope();

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
                'details': 'The server returned an error finding a team mathcing supplied id.',
                'append':  true
            });
            res.json( envelope );
            return;
        });
    });

    // follow team
    router.get( '/teams/follow/:teamId', auth.requireUser , function( req , res , next ) {
        // TODO: validate team Id is supplied
        var teamId = req.params.teamId || 0;
        envelope = new Envelope();

        Team.findOneAsync({
            '_id': teamId
        })
        .then( function ( team ) {
            req.user.followedTeams.push( team._id.toString() );
            console.log( 'follow' , req.user.followedTeams );
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
                'details': 'The server returned an error finding a team mathcing supplied id.',
                'append':  true
            });
            res.json( envelope );
            return;
        });
    });

    // unfollow team
    router.get( '/teams/unfollow/:teamId', auth.requireUser , function( req , res , next ) {
        // TODO: validate team Id is supplied
        var teamId = req.params.teamId || 0;
        envelope = new Envelope();

        Team.findOneAsync({
            '_id': teamId
        })
        .then( function ( team ) {
            var teamIndex = req.user.followedTeams.indexOf( team._id.toString() );
            req.user.followedTeams.splice( teamIndex , 1 );
            console.log( 'unfollow' , req.user.followedTeams );
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
                'details': 'The server returned an error finding a team mathcing supplied id.',
                'append':  true
            });
            res.json( envelope );
            return;
        });
    });

    /*// sport
    router.get( '/teams/:sport', auth.requireUser , function( req , res , next ) {
        console.log( 'foo' );
        return;
    });

    // season
    router.get( '/teams/:season', auth.requireUser , function( req , res , next ) {
        console.log( 'foo' );
        return;
    });

    // level
    router.get( '/teams/:level', auth.requireUser , function( req , res , next ) {
        console.log( 'foo' );
        return;
    });*/
};
