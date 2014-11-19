
'use strict';

var config = require( '../../config' );

exports = module.exports = function routes ( app , router ) {

    // Load `*.js` under current directory
    require( 'fs' )
        .readdirSync( __dirname + '/' )
            .forEach(
                function( file ) {
                    if (
                        ( file.match( /.+\.js/g ) !== null ) &&
                        ( file !== 'index.js' )
                    ) {
                        var name       = file.replace( '.js' , '' ),
                            fileFunc   = require( './' + file );
                            // ,
                            // fileObject = fileFunc();

                            fileFunc( router );
                    }
                }
            );

    app.use( config.versionPrefix, router );
};
