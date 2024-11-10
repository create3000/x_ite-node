// JSDOM

const
   { JSDOM }         = require ("jsdom"),
   { window }       = new JSDOM (),
   { LocalStorage } = require ("node-localstorage"),
   path             = require ("path"),
   fs               = require ("fs"),
   os               = require ("os");

const tmp = fs .mkdtempSync (path  .join (os .tmpdir (), "x_ite"));

window .require = require;


Object .defineProperties (window,
{
   // require
   require: require,
   // storages
   localStorage:
   {
      value: new LocalStorage (path .join (tmp, "Local Storage")),
      configurable: true,
   },
   sessionStorage:
   {
      value: new LocalStorage (path .join (tmp, "Session Storage")),
      configurable: true,
   },
});

// Window

Object .assign (global, window);

// X_ITE

const X3D = require ("x_ite");

module .exports = X3D;
