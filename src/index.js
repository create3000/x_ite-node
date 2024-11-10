// JSDOM

const
   { JSDOM }         = require ("jsdom"),
   { window }       = new JSDOM (),
   { LocalStorage } = require ("node-localstorage"),
   path             = require ("path"),
   fs               = require ("fs"),
   os               = require ("os"),
   tmp              = fs .mkdtempSync (path  .join (os .tmpdir (), "x_ite"));

// Node `require`.

window .require = require;

// Storages

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

// Window

Object .assign (global, window);

// HTMLElement

global .HTMLElement = window .HTMLElement;

// X_ITE

const X3D = require ("x_ite");

module .exports = X3D;
