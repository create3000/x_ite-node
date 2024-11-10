// JSDOM

require ("jsdom-global") ();

const
   { LocalStorage } = require ("node-localstorage"),
   path             = require ("path"),
   fs               = require ("fs"),
   os               = require ("os"),
   tmp              = fs .mkdtempSync (path  .join (os .tmpdir (), "x_ite"));

// Window

Object .defineProperties (window,
{
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

window .customElements = { define: function () { } };

// Global

global .require        = require;
global .customElements = window .customElements;

// X_ITE

const X3D = require ("x_ite");

module .exports = X3D;
