
// JSDOM

const
   { JSDOM }  = require ("jsdom"),
   { window } = new JSDOM ();

Object .assign (global, window);

// X_ITE

const X3D = require ("x_ite");

module .exports = X3D;
