/**
 * Route Utilities
 *
 * A module with common methods to assist in keeping route logic DRY
**/

exports.findModelMembers = function findModelMembers ( model ) {
    var keys = [],
        key;

    for( key in model.schema.paths ){
        if( model.schema.paths.hasOwnProperty( key ) ){
            keys.push( key );
        }
    }

    return keys;
};

exports.getSearchQuery = function getSearchQuery ( options ) {
    var opts        = options || {},
        keys        = opts.keys || [],
        query       = opts.query || '',
        queryObject = {},
        textSearch, param;

    for( param in query ) {
        // access token used to validate request,
        // don't need to include in query
        if( param === 'access_token' ){
            continue;
        }

        // full text searching on text indexes.
        if( param === 'q' ){
            queryObject.$text = { $search : query[ param ] };
        }

        // see if query param is in model
        if( keys.indexOf( param ) >= 0 ) {
            queryObject[ param ] = query[ param ];
        }
    }

    return queryObject;
};
