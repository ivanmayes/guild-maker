
'use strict';

var _ = require( 'lodash' );

/**
 * API Envelope
 *
 * A generic module representing an api response
 *
 * This standardizes the format of api responses and
 * follows best practices that have emerged.
 * Foursquare is one of the sites that follows these
 * best practices, so we can use them as our
 * main point of reference.
 *
 * {
 *     "meta": {
 *         "code": 200,
 *         ...errorType and errorDetail...
 *     },
 *     "notifications": {
 *         ...notifications...
 *     },
 *     "response": {
 *         ...results...
 *     }
 * }
 */

var Envelope = function Envelope () {

    this.reset();

    // this.meta          = Object.create( Object.prototype );
    // this.response      = Object.create( Object.prototype );
    // this.notifications = Object.create( Object.prototype );

    return this;
};

/**
 * Getter/Setter for Meta Object of Envelope
 * using Object.defineProperty to define getter/setter accessors of the
 * Envelope Object.
 *
 * get:
 *     @returns {Object} Returns Meta Object
 *
 * set:
 *     @param   {Object} meta Sets the Meta Object
 *     @returns {Object} Returns Meta Object

 */
Object.defineProperty( Envelope , 'meta' , {
    get: function () {
        return this.meta;
    },
    set: function ( metadata ) {
        this.meta = metadata || Object.create( Object.prototype );
    }
});

/**
 * Getter/Setter for Response Object of Envelope
 * using Object.defineProperty to define getter/setter accessors of the
 * Envelope Object.
 *
 * get:
 *     @returns {Object} Returns Response Object
 *
 * set:
 *     @param   {Object} response Sets the Response Object
 *     @returns {Object} Returns Response Object

 */
Object.defineProperty( Envelope , 'response' , {
    get: function () {
        return this.response;
    },
    set: function ( response ) {
        this.response = response || Object.create( Object.prototype );
    }
});

/**
 * Getter/Setter for Notifications Object of Envelope
 * using Object.defineProperty to define getter/setter accessors of the
 * Envelope Object.
 *
 * get:
 *     @returns {Object} Returns Notifications Object
 *
 * set:
 *     @param   {Object} response Sets the Notifications Object
 *     @returns {Object} Returns Notifications Object

 */
Object.defineProperty( Envelope , 'notifications' , {
    get: function () {
        return this.notifications;
    },
    set: function ( notifications ) {
        this.notifications = notifications || Object.create( Object.prototype );
    }
});


Envelope.prototype.reset = function reset () {
    var data = this.status_codes[ '400' ];

    this.meta = {
        'code': data.code,
        'errorType': data.errorType,
        'errorDetail': data.details
    };

    return this;
};

Envelope.prototype.error = function error ( options ) {
    var opts    = options || {},
        code    = opts.code,
        type    = opts.type,
        detail  = opts.detail,
        append  = opts.append;


    if( !append ){
        append = true;

        if( code && code !== this.meta.code ){
            append = false;
            this.meta.errorDetail = '';
        }

        if(
            ( type ) &&
            (
                ( !this.meta.errorType ) ||
                ( this.meta.errorType !== type )
            )
        ){
            append = false;
            this.meta.errorType = '';
        }
    }

    if( code ) {
        this.meta.code = code;
    }

    if( this.meta.code === 200 ) {
        this.meta.code = 400;
        append = false;
    }

    if( type ) {
        this.meta.errorType = type;
    }

    if( !this.meta.errorType ) {
        this.meta.errorType = 'param_error';
    }

    if ( !Array.isArray( detail ) ) {
        // comma seperated list? i dunno.
        detail = detail.split( ',' );
    }

    if( !append ) {
        this.meta.errorDetail = detail;
    }
    else{
        if( Array.isArray( this.meta.errorDetail ) ) {
            this.meta.errorDetail = [ this.meta.errorDetail ];
        }
        else {
            _.union( this.meta.errorDetail , detail );
        }
    }

    return this;
};

Envelope.prototype.success = function success ( options ) {
    var opts    = options || {},
        code    = opts.code,
        data    = opts.data;

    this.meta.code = 200;
    this.response  = data;

    return this;
};


Envelope.prototype.status_codes = {
    '200': {
        'code': 200,
        'errorType': 'success',
        'details': ''
    },
    '400': {
        'code': 400,
        'errorType': 'param_error',
        'details': 'A required parameter was missing or a parameter was malformed.'
    },
    '401': {
        'code': 401,
        'errorType': 'invalid_auth',
        'details': 'OAuth token was not provided or was invalid.'
    },
    '403': {
        'code': 403,
        'errorType': 'not_authorized',
        'details': 'User is not authorized to take this action.'
    },
    '404': {
        'code': 404,
        'errorType': 'endpoint_error',
        'details': 'The requested path does not exist.'
    },
    '405': {
        'code': 405,
        'errorType': 'not_allowed',
        'details': 'Attempting to use POST with a GET-only endpoint, or vice-versa.'
    },
    '409': {
        'code': 409,
        'errorType': 'conflict',
        'details': 'The request could not be completed as it is.'
    },
    '500': {
        'code': 500,
        'errorType': 'internal_error',
        'details': 'The server is experiencing melancholy.'
    }
};

exports = module.exports = Envelope;
