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
   MutationObserver:
   {
      value: class
      {
         observe () { }
         disconnect () { }
      },
      configurable: true,
      writable: true,
   },
   ResizeObserver:
   {
      value: class
      {
         observe () { }
         disconnect () { }
      },
      configurable: true,
      writable: true,
   },
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
      value: { define: Function .prototype },
      configurable: true,
      writable: true,
      enumerable: true,
   },
   requestAnimationFrame:
   {
      value: Function .prototype,
      configurable: true,
      writable: true,
      enumerable: true,
   },
});

// Global

Object .defineProperties (global,
{
   MutationObserver:
   {
      value: window .MutationObserver,
      configurable: true,
      writable: true,
   },
   ResizeObserver:
   {
      value: window .ResizeObserver,
      configurable: true,
      writable: true,
   },
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
   createBrowser = X3D .createBrowser,
   gl            = require ("nogl");

X3D .createBrowser = function (... args)
{
   const canvas = createBrowser .apply (X3D, args);

   canvas .browser = new X3D .X3DBrowser (canvas);

   return canvas;
};

X3D .Context .create = function (canvas, version, preserveDrawingBuffer, mobile)
{
   return Object .assign (gl (),
   {
      getVersion: function () { return 2; },
      blendEquationSeparate: Function .prototype,
      blendFuncSeparate: Function .prototype,
      drawBuffers: Function .prototype,
      renderbufferStorageMultisample: Function .prototype,
      texImage3D: Function .prototype,
   });
};

module .exports = X3D;
