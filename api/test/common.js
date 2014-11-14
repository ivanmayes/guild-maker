
'use strict';

var chai      = require( 'chai' ),
    sinon     = require( 'sinon' ),
    sinonChai = require( 'sinon-chai' );

chai.use( sinonChai );

global.sinon          = sinon;
global.chai           = chai;
global.assert         = chai.assert;
// global.expect         = chai.expect;
// global.should         = chai.should();
global.AssertionError = chai.AssertionError;
