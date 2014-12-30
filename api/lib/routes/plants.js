
'use strict';

var Envelope    = require( '../envelope' ),
    routeUtils  = require( '../route-utils' ),
    Plant      = require( '../models/plant' ),
    envelope;


exports = module.exports = function PlantRoutes( auth , router ) {

    // get list of all schools
    router.get( '/plants', auth.requireUser, function( req , res , next ) {
        envelope = new Envelope();

        Plant.findAsync({})
            .then( function ( plants ) {
                envelope.success( 200 , plants );
                res.json( envelope );
                return;
            })
            .catch( function ( err ) {
                envelope.error( 500 , {
                    'details': 'The server returned an error finding all plants.',
                    'append':  true
                });
                res.json( envelope );
                return;
            });
    });

    router.get( '/plants/search' , function( req , res , next ) {
        var keys, query;

        envelope = new Envelope();

        // cache members of model.
        keys = routeUtils.findModelMembers( Plant );

        //console.log('Keys', keys);

        // If we pass plant ids, make an $or query
        if(req.plantIds) {
           var plantIdObj = [];
           for (var key in validation_messages) {
             plantIdObj.push({'_id':req.plantIds[key]});
           }
           console.log(plantIdObj);
           req.plantIds = null;
        }

        // obtain query schema
        query = routeUtils.getSearchQuery({
            'keys':  keys,
            'query': req.query
        });

        if(plantIdObj) {
            query["$or"] = plantIdObj;
        }

        console.log('query', query);

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

        Plant
            .findAsync( query )
                .then( function ( plants ) {
                    envelope.success( 200 , plants );
                    res.json( envelope );
                    return;
                })
                .catch( function ( err ) {
                    envelope.error( 500 , {
                        'details': 'The server returned an error finding plants matching supplied arguments.',
                        'append':  true
                    });
                    res.json( envelope );
                    return;
                });
        return;
    });

    router.get( '/plants/:plantId' , function( req , res , next ) {
        var plantId = req.params.plantId;
        envelope = new Envelope();

        if( !plantId ){
            // no plantId present, return error envelope
            envelope.error( 400 , {
                'details': 'Missing Plant Id.',
                'append':  true
            });
            res.json( envelope );
            return;
        }

        Plant.findOneAsync({
            '_id': plantId
        })
        .then( function ( plant ) {
            envelope.success( 200 , plant );
            res.json( envelope );
            return;
        })
        .catch( function ( err ) {
            envelope.error( 500 , {
                'details': 'The server returned an error finding a plant matching supplied id.',
                'append':  true
            });
            res.json( envelope );
            return;
        });
    });

};
