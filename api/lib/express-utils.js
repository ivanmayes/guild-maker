/**
 * Standard utils for Express apps at Shoptology
 */


var expressUtils = {},
    cors         = require( 'cors' ),
    bodyParser     = require( 'body-parser' );

exports = module.exports = expressUtils = {

    /**
     * Setup body parsing. Only have urlencoded so far.
     * Add more as needed.
     *
     * @param  object app Express instance
     * @return object app Express instance
     */
    bodyParser: function( app ) {
        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: true }));

        // parse application/json
        app.use(bodyParser.json());

        // parse plain text
        app.use(bodyParser.text());

        // parse various different custom JSON types as JSON
        app.use(bodyParser.json({ type: 'application/*+json' }));

        // parse an HTML body into a string
        // app.use(bodyParser.text({ type: 'text/plain' }));

        // @todo use https://github.com/andrewrk/node-multiparty/ for file uploads

        return app;
    },

    /**
     * Open CORS config. Allows from any origin.
     *
     * @param  object app Express instance
     * @return object app Express instance
     */
    cors: function( app ) {
        app.use( cors( {
            origin: true,
            methods: 'GET,PUT,POST,DELETE,OPTIONS',
            allowedHeaders: 'Authorization,Content-Type,Accept,Origin,' +
                'User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,' +
                'X-Requested-With,If-Modified-Since,Content-Range,' +
                'Content-Disposition,Content-Description,Access-Control-Allow-Origin',
            credentials: true,
            maxAge: 1728000
        } ) );
        return app;
    },

    /**
     * One stop shop to configure out Express instances in the standard way.
     *
     * @param  object app Express instance
     * @return object app Express instance
     */
     init: function( app ) {
        expressUtils.trustProxy( app );
        expressUtils.cors( app );
        expressUtils.bodyParser( app );
        return app;
     },

     /**
      * Use when Express lives behind a trusted load-balancer
      * (this is standard for us as we deploy on EC2 with Elastic Load Balancers)
      *
     * @param  object app Express instance
     * @return object app Express instance
      */
     trustProxy: function( app ) {
        app.enable('trust proxy');
     }

};
