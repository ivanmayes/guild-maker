/**
 * Route Utilities
 *
 * A module with common methods to assist in keeping route logic DRY
**/

'use strict';

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

exports.validatePrefs = function validatePrefs ( prefs ) {

    // group is mandatory
    if( !prefs.group ) {
        return false;
    }

    if( prefs.scope === 'global' ){
        // should not have a school defined
        if( prefs.school ) {
            return false;
        }
    }

    if( prefs.scope !== 'global' ){
        // school_### / team_###

        if(
            ( prefs.scope.substring( 0 , 5 ) === 'team_' ) ||
            ( prefs.scope.substring( 0 , 7 ) === 'school_' )
        ) {
            // the scope is a either a team or school, school id needs to be set
            if( !prefs.school ) {
                return false;
            }
        }
    }

    return true;
};

exports.determinePaginationTimestamps = function determinePaginationTimestamps ( options ) {
    var opts      = options || {},
        stream    = opts.stream || [],
        field     = opts.field || 'publishTime',
        timestamp = {
            prev: 0,
            next: 0
        };
};
