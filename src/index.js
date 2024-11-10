// JSDOM

require ("jsdom-global") ();

// Preparations

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
      writable: true,
      enumerable: true,
   },
   sessionStorage:
   {
      value: new LocalStorage (path .join (tmp, "Session Storage")),
      configurable: true,
      writable: true,
      enumerable: true,
   },
   customElements:
   {
      value: { define: function () { } },
      configurable: true,
      writable: true,
      enumerable: true,
   },
});

// Global

Object .defineProperties (global,
{
   require:
   {
      value: require,
      configurable: true,
      writable: true,
   },
   localStorage:
   {
      value: window .localStorage,
      configurable: true,
      writable: true,
      enumerable: true,
   },
   sessionStorage:
   {
      value: window .sessionStorage,
      configurable: true,
      writable: true,
      enumerable: true,
   },
   customElements:
   {
      value: window .customElements,
      configurable: true,
      writable: true,
      enumerable: true,
   },
});

// X_ITE

const
   X3D           = require ("x_ite"),
   createBrowser = X3D .createBrowser;

X3D .createBrowser = function (... args)
{
   const canvas = createBrowser .apply (X3D, args);

   canvas .browser = new X3D .X3DBrowser (canvas);

   return canvas;
};

module .exports = X3D;
