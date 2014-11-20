
'use strict';

var validator   = require( 'validator' ),
    Promises    = require( 'bluebird' ),
    Envelope    = require( '../envelope' ),
    auth        = require( '../auth' ),
    User        = require( '../models/user' ),
    AccessToken = require( '../models/token' ),
    envelope;

exports = module.exports = function UserRoutes( router ) {

    router.get( '/me', auth.requireUser, function( req , res , next ) {
        // curl -v http://localhost:3000/foo?access_token=[token]
        envelope = new Envelope();

        envelope.success( 200 , {
            firstName: req.user.firstName,
            lastName:  req.user.lastName,
            email:     req.user.email
        });

        res.json( envelope );
        return;
    });

    router.post( '/signup', function( req , res ) {

        var userName   = validator.trim( req.body.userName ),
            firstName  = validator.trim( req.body.firstName ),
            lastName   = validator.trim( req.body.lastName ),
            email      = validator.normalizeEmail( validator.trim( req.body.email ) ),
            password   = req.body.password,
            errDetails = [],
            user;

        envelope = new Envelope();

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
        })
        .catch( function ( e ) {
            envelope.error( 401 , {
                'details': [ 'The server returned an error checking for existing user with signup data.' , e.message ],
                'append':  true
            });
            return res.json( envelope );
        });

        if( !firstName ) {
            errDetails.push( 'first name is missing.' );
        }

        if( !lastName ) {
            errDetails.push( 'last name is missing.' );
        }

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
                    firstName: user.firstName,
                    lastName:  user.lastName,
                    name:      user.name,
                    email:     user.email,
                    token:     token
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

    } );

    router.post( '/login', function( req , res ) {
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
        .then( function ( token ) {
            if ( !token ) {
                envelope.error( 401 , {
                    'details': 'No token provided',
                    'append':  true
                });

                return res.json( envelope );
            }

            envelope.success( 200 , {
                token: token
            });

            return res.json( envelope );
        })
        .catch( function( e ) {
            envelope.error( 401 , {
                'details': [ 'The server returned an error exchanging a password for a token.' , e.message ],
                'append':  true
            });
            res.json( envelope );
        });

        // curl -d "email=test%40example.com&password=password" http://127.0.0.1:3000/v1/login
    });
};

