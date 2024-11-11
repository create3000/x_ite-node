// JSDOM

require ("jsdom-global") ();

// Preparations

const
   { LocalStorage } = require ("node-localstorage"),
   path             = require ("path"),
   url              = require ("url"),
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
   atob:
   {
      value: require ("atob"),
      configurable: true,
      writable: true,
      enumerable: true,
   },
   cancelAnimationFrame:
   {
      value: clearTimeout,
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
   fetch:
   {
      value: function (resource, options)
      {
         const parsedURL = new URL (resource);

         if (parsedURL .protocol === "file:")
         {
            return new Promise ((resolve, reject) =>
            {
               const filePath = url .fileURLToPath (parsedURL);

               fs .readFile (filePath, (error, data) =>
               {
                  if (error)
                     reject (error);
                  else
                     resolve (new Response (data));
               });
            });
         }
         else
         {
            return require ("node-fetch") (resource, options);
         }
      },
      configurable: true,
      writable: true,
      enumerable: true,
   },
   localStorage:
   {
      value: new LocalStorage (path .join (tmp, "Local Storage")),
      configurable: true,
      writable: true,
      enumerable: true,
   },
   requestAnimationFrame:
   {
      value: callback => setTimeout (() => callback (performance .now ()), 0),
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
   atob:
   {
      value: window .atob,
      configurable: true,
      writable: true,
   },
   customElements:
   {
      value: window .customElements,
      configurable: true,
      writable: true,
      enumerable: true,
   },
   fetch:
   {
      value: window .fetch,
      configurable: true,
      writable: true,
      enumerable: true,
   },
   localStorage:
   {
      value: window .localStorage,
      configurable: true,
      writable: true,
      enumerable: true,
   },
   require:
   {
      value: require,
      configurable: true,
      writable: true,
   },
   sessionStorage:
   {
      value: window .sessionStorage,
      configurable: true,
      writable: true,
      enumerable: true,
   },
});

// Web Audio Shim

const audioNodes = [
   "AnalyserNode",
   "Audio",
   "AudioContext",
   "BiquadFilterNode",
   "ChannelMergerNode",
   "ChannelSplitterNode",
   "ConvolverNode",
   "DelayNode",
   "DynamicsCompressorNode",
   "GainNode",
   "MediaStreamAudioDestinationNode",
   "PannerNode",
   "WaveShaperNode",
];

class AudioNode {
   #listener;
   connect () { return this; }
   createBuffer () { return new AudioNode (); }
   createMediaElementSource () { return new AudioNode (); }
   createMediaStreamDestination () { return new AudioNode (); }
   disconnect () { }
   async play () { }
   async resume () { }
   get attack () { return { } }
   get delayTime () { return { } }
   get destination () { return { maxChannelCount: 2 }; }
   get detune () { return { } }
   get forwardX () { return { } }
   get forwardY () { return { } }
   get forwardZ () { return { } }
   get frequency () { return { } }
   get gain () { return { } }
   get knee () { return { } }
   get listener () { return this .#listener ??= new AudioNode (); }
   get orientationX () { return { } }
   get orientationY () { return { } }
   get orientationZ () { return { } }
   get positionX () { return { } }
   get positionY () { return { } }
   get positionZ () { return { } }
   get Q () { return { } }
   get ratio () { return { } }
   get release () { return { } }
   get threshold () { return { } }
   get upX () { return { } }
   get upY () { return { } }
   get upZ () { return { } }
}

Object .defineProperties (window, Object .fromEntries (audioNodes .map (name => [name,
{
   value: class extends AudioNode { },
   configurable: true,
   writable: true,
}])));

Object .defineProperties (global, Object .fromEntries (audioNodes .map (name => [name,
{
   value: window [name],
   configurable: true,
   writable: true,
}])));

// XML

global .XMLDocument = window .Document;

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

const glFunctions = Object .fromEntries ([
   "bindVertexArray",
   "blendEquationSeparate",
   "blendFuncSeparate",
   "blitFramebuffer",
   "copyBufferSubData",
   "createTransformFeedback",
   "createVertexArray",
   "drawBuffers",
   "renderbufferStorageMultisample",
   "texImage3D",
   "transformFeedbackVaryings",
   "uniform1f",
   "uniform3f",
   "uniformMatrix4fv",
   "vertexAttribDivisor",
]
.map (name => [name, Function .prototype]));

X3D .Context .create = function (canvas, version, preserveDrawingBuffer, mobile)
{
   return Object .assign (gl (), glFunctions,
   {
      getVersion: function () { return 2; },
   });
};

module .exports = X3D;
