
'use strict';

var validator = require( 'validator' ),
    Promises  = require( 'bluebird' ),
    Envelope  = require( '../envelope' ),
    auth      = require( '../auth' ),
    User      = require( '../models/user' ),
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
        var valid     = false,
            userName  = req.body.userName,
            firstName = req.body.firstName,
            lastName  = req.body.lastName,
            email     = req.body.email,
            password  = req.body.password;

        envelope = new Envelope();

        if( !valid ) {
            envelope.error();
        }

        // curl -d "userName=Test&firstName=Test&lastName=User&email=test%40example.com&password=password" http://127.0.0.1:3000/v1/signup

        // auth.hashPassword( req.body.password , function ( err , hash ) {

        /****/
        auth.hashPassword( req.body.password , function ( err , hash ) {
            if( err ){
                // handleError( err );
                return;
            }

            User.create(
                {
                    'userName':  req.body.userName,
                    'firstName': req.body.firstName,
                    'lastName':  req.body.lastName,
                    'email':     req.body.email,
                    'password':  hash
                },
                function ( err , user ) {
                    accessToken.createToken({
                        'client': { id: 'Shoptology.wut.wut' },
                        'user':   user,
                        'scope':  null
                    },
                    function( err , token ) {
                        if ( err ) {
                            res.json( {
                                meta: {
                                    code: 400,
                                    errorType: 'server_error',
                                    errorDetail: "The server returned an error creating a token for userId: " + user._id.toString() + "."
                                }
                            } );
                        }
                        res.json( {
                            meta: { code: 200 },
                            response: {
                                firstName: user.firstName,
                                lastName:  user.lastName,
                                name:      user.name,
                                email:     user.email,
                                token:     token
                            }
                        } );
                    });
                });
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
                res.json( envelope );

                return;
            }
            /******/

            envelope.success( 200 , {
                token: token
            });

            res.json( envelope );
            return;
        })
        .catch( function( e ) {
            envelope.error( 401 , {
                'details': 'The server returned an error exchanging a password for a token.',
                'append':  true
            });
            res.json( envelope );
        });

        // curl -d "email=test%40example.com&password=password" http://127.0.0.1:3000/v1/login
    });
};

