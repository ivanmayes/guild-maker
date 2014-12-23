
'use strict';

var _           = require( 'lodash' ),
    validator   = require( 'validator' ),
    moment      = require( 'moment' ),
    routeUtils  = require( '../route-utils' ),
    Envelope    = require( '../envelope' ),
    User        = require( '../models/user' ),
    AccessToken = require( '../models/token' ),
    envelope;

exports = module.exports = function UserRoutes( auth , router ) {

    router.get( '/me' , auth.requireUser , function( req , res , next ) {
        // console.log( 'foofoofoofoofoofoofoofoo' );
        // curl -v http://localhost:3000/v1/me?access_token=[token]
        envelope = new Envelope();

        User.findOneAsync({
            'email': req.user.email
        })
        .then( function ( user ) {
            envelope.success( 200 , user );
            return res.json( envelope );
        })
        .catch( function ( e ) {
            envelope.error( 401 , {
                'details': [ 'The server returned an error finding current user.' , e.message ],
                'append':  true
            });
            return res.json( envelope );
        });

        return;
    });

    router.post( '/signup' , function( req , res ) {
        var userName   = validator.trim( req.body.userName ),
            firstName  = validator.trim( req.body.firstName ),
            lastName   = validator.trim( req.body.lastName ),
            email      = validator.normalizeEmail( validator.trim( req.body.email ) ),
            password   = req.body.password,
            errDetails = [],
            user;

        envelope = new Envelope();

        // if( !firstName ) {
        //     errDetails.push( 'first name is missing.' );
        // }

        // if( !lastName ) {
        //     errDetails.push( 'last name is missing.' );
        // }

        if( !req.body.email ) {
            errDetails.push( 'email is missing.' );
        }

        if( !validator.isEmail( email ) ) {
            errDetails.push( 'email is not a valid email.' );
        }

        if( !password ) {
            errDetails.push( 'password is missing.' );
        }

        if( errDetails.length > 0 ) {
            // we have errors!
            envelope.error( 400 , {
                'details': errDetails,
                'append':  true
            });

            res.json( envelope );
            return;
        }

        // check for existing user
        User.findOneAsync({
            'email': email
        })
        .then( function ( usr ) {
            if( usr ){
                envelope.error( 400 , {
                    'details': 'A user with that email exists.',
                    'append':  true
                });

                res.json( envelope );
                return;
            }

            // curl -d "userName=Test&firstName=Test&lastName=User&email=test%40example.com&password=password" http://127.0.0.1:3000/v1/signup
            auth.hashPassword( req.body.password )
                .then( function ( hash ) {
                    return User.createAsync({
                        'userName':  userName,
                        'firstName': firstName,
                        'lastName':  lastName,
                        'email':     email,
                        'password':  hash
                    });
                })
                .then( function ( usr ) {

                    // cache closure
                    user = usr;

                    return AccessToken.createToken({
                        'client': { id: 'Shoptology.wut.wut' },
                        'user':   user,
                        'scope':  null
                    });
                })
                .then( function ( token ) {
                    envelope.success( 200 , {
                        user:  user,
                        token: token
                    });

                    return res.json( envelope );
                })
                .catch( function( e ) {
                    envelope.error( 401 , {
                        'details': [ 'Could not create account.' , e.message ],
                        'append':  true
                    });
                    res.json( envelope );
                });


        })
        .catch( function ( e ) {
            envelope.error( 401 , {
                'details': [ 'The server returned an error checking for existing user with signup data.' , e.message ],
                'append':  true
            });
            return res.json( envelope );
        });
    });

    router.post( '/login' , function( req , res ) {
        var valid     = false,
            email     = validator.normalizeEmail( validator.trim( req.body.email ) ),
            password  = req.body.password,
            errDetails;

        envelope = new Envelope();

        valid = ( validator.isEmail( email ) && password ) ? true : false;

        if( !valid ) {
            errDetails = [];

            if( !validator.isEmail( email ) ) {
                errDetails.push( 'email is not a valid email.' );
            }

            if( !req.body.email ) {
                errDetails.push( 'email is missing.' );
            }

            if( !password ) {
                errDetails.push( 'password is missing.' );
            }

            envelope.error( 400 , {
                'details': errDetails,
                'append':  true
            });
            res.json( envelope );

            return;
        }

        auth.exchangePassword(
            { id: 'Shoptology.wut.wut' },
            email,
            password,
            null
        )
        .then( function ( obj ) {
            if ( !obj.token ) {
                envelope.error( 401 , {
                    'details': 'No token provided',
                    'append':  true
                });

                return res.json( envelope );
            }

            // password was successfully exchanged, create a succes
            // envelope and return that bad boy to the calling view
            envelope.success( 200 , {
                token: obj.token
            });

            // send response
            res.json( envelope );

            // front end can proceed, in parallel we're gonna update the
            // user's last visit time to be now... bc they just logged in.
            obj.user.lastVisitTime = Date.now();
            obj.user.saveAsync()
                .spread( function ( savedUser , numAffected ) {
                    if( numAffected < 1 ){
                        throw new Error( 'Error updating User\'s lastVisitTime.' );
                    }
                })
                .catch( function( err ) {
                    throw new Error( 'Error updating User\'s lastVisitTime.' );
                });

            // now bail.
            return;
        })
        .catch( function( e ) {
            var code = 500;
            if( e.statusCode ) {
                code = e.statusCode;
            }
            if( code !== 401 ){
                log.info( e );
            }
            envelope.error( code , {
                'details': 'The server returned an error exchanging a password for a token.',
                'append':  false
            });
            res.json( envelope );
        });

        // curl -d "email=test%40example.com&password=password" http://127.0.0.1:3000/v1/login
    });

    router.post( '/updatePassword' , auth.requireUser , function( req , res ) {
        var password   = req.body.password,
            errDetails = [],
            saltedPW;

        envelope = new Envelope();

        // if( !validator.isMongoId( userId ) ) {
        //     errDetails.push( 'UserId is not a valid Mongo Id.' );
        // }

        if( !password ) {
            errDetails.push( 'password is missing.' );
        }

        if( errDetails.length > 0 ) {
            // we have errors!
            envelope.error( 400 , {
                'details': errDetails,
                'append':  true
            });

            res.json( envelope );
            return;
        }

        auth.hashPassword( password )
            .then( function ( hash ) {
                saltedPW = hash;
                return User.findOneAsync({
                    '_id':  req.user._id
                });
            })
            .then( function ( usr ) {
                usr.password = saltedPW;
                usr.saveAsync()
                    .spread( function( savedUser , numAffected ) {
                        if( numAffected < 1 ){
                            throw new Error( 'Error updating User\'s password.' );
                        }

                        envelope.success( 200 , savedUser );
                        res.json( envelope );
                    })
                    .catch( function( err ) {
                        throw new Error( 'Error updating User\'s password.' );
                    });
            })
            .catch( function( e ) {
                var code = 500;
                if( e.statusCode ) {
                    code = e.statusCode;
                }
                if( code !== 401 ){
                    log.info( e );
                }
                envelope.error( code , {
                    'details': 'The server returned an error updating User\'s password.',
                    'append':  false
                });
                res.json( envelope );
            });
    });

    router.get( '/users' , auth.requireUser , function( req , res ) {
        envelope = new Envelope();

        User.findAsync({})
            .then( function ( users ) {
                envelope.success( 200 , users );
                res.json( envelope );
                return;
            })
            .catch( function ( err ) {
                envelope.error( 500 , {
                    'details': 'The server returned an error finding all users.',
                    'append':  true
                });
                res.json( envelope );
                return;
            });
    });

    router.get( '/users/:userId' , auth.requireUser , function( req , res ) {
        var userId = req.params.userId;
        envelope = new Envelope();

        if( !userId ){
            // no userId present, return error envelope
            envelope.error( 400 , {
                'details': 'Missing User Id.',
                'append':  true
            });
            res.json( envelope );
            return;
        }

        User.findOneAsync({
            '_id': userId
        })
        .then( function ( user ) {
            envelope.success( 200 , user );
            res.json( envelope );
            return;
        })
        .catch( function ( err ) {
            envelope.error( 500 , {
                'details': 'The server returned an error finding a user matching supplied id.',
                'append':  true
            });
            res.json( envelope );
            return;
        });
    });

    router.post( '/users/update' , auth.requireUser , function( req , res ) {
        var username    = validator.trim( req.body.userName ),
            firstName   = validator.trim( req.body.firstName ),
            lastName    = validator.trim( req.body.lastName ),
            email       = validator.normalizeEmail( validator.trim( req.body.email ) ),
            group       = validator.trim( req.body.group ),
            birthday    = validator.trim( req.body.birthday ),
            preferences = req.body.preferences,
            user        = req.user,
            queryObj    = {},
            valid;

        envelope = new Envelope();

        // append username to query object
        if( username ) {
            queryObj.username = username;
        }

        // append firstName to query object
        if( firstName ) {
            queryObj.firstName = firstName;
        }

        // append lastName to query object
        if( lastName ) {
            queryObj.lastName = lastName;
        }

        // append email to query object
        if( validator.isEmail( email ) ) {
            queryObj.email = email;
        }

        // append group to query object
        if( group ) {
            queryObj.group = group;
        }

        // append birthday to query object
        if( birthday ) {
            queryObj.birthday = moment( birthday ).toDate();
        }

        // append preferences to query object
        if( preferences ) {
            _( preferences ).each( function ( pref , idx ) {
                valid = routeUtils.validatePrefs( pref );
                if( !valid ){
                    envelope.error( 500 , {
                        'details': 'Invalid notifications setting.',
                        'append':  true
                    });
                    res.json( envelope );
                    return false;
                }
            } , this );

            if( !valid ) {
                return;
            }

            queryObj.preferences = preferences;
        }

        if( Object.getOwnPropertyNames( queryObj ).length === 0 ){
            // after parsing, no valid query present...
            // send error envelope and bail
            envelope.error( 400 , {
                'details': 'Missing update parameters.',
                'append':  true
            });
            res.json( envelope );
            return;
        }

        User.updateAsync(
            {
                '_id': user._id
            },
            queryObj
        )
        .spread( function ( numAffected , response ) {
            var updatedExisting = response.updatedExisting || '';

            if( updatedExisting === '' ){
                updatedExisting = false;
            }

            if(
                ( updatedExisting ) &&
                ( numAffected > 0 )
            ){
                return User.findOneAsync({
                    'email': email || user.email
                });
            }

            envelope.error( 500 , {
                'details': 'No Users updated.'
            });
            res.json( envelope );
            return;
        })
        .then( function ( user ) {
            envelope.success( 200 , user );
            return res.json( envelope );
        })
        .catch( function ( err ) {
            envelope.error( 500 , {
                'details': 'The server returned an error updating user with supplied arguments.'
            });
            res.json( envelope );
            return;
        });

        return;
    });

};
