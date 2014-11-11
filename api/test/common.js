
'use strict';

global.sinon          = require( 'sinon' );
global.chai           = require( 'chai' );
global.assert         = require( 'chai' ).assert;
// global.expect         = require( 'chai' ).expect;
// global.should         = require( 'chai' ).should();
global.AssertionError = require( 'chai' ).AssertionError;

var sinonChai = require( 'sinon-chai' );
chai.use( sinonChai );
