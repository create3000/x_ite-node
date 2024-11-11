// JSDOM

// Restore it later.
const BlobClass = Blob;

require ("jsdom-global") ();

// Preparations

const
   { LocalStorage } = require ("node-localstorage"),
   path             = require ("path"),
   url              = require ("url"),
   fs               = require ("fs"),
   os               = require ("os"),
   tmp              = fs .mkdtempSync (path .join (os .tmpdir (), "x_ite"));

// Window

Object .defineProperties (window,
{
   Blob:
   {
      value: BlobClass,
      configurable: true,
      writable: true,
   },
   FileReader:
   {
      value: class extends require ("filereader")
      {
         constructor ()
         {
            super ();

            const readAsDataURL = this .readAsDataURL;

            this .readAsDataURL = async function (... args)
            {
               if (args [0] instanceof Blob)
               {
                  const
                     blob   = args [0],
                     buffer = Buffer .from (await blob .arrayBuffer ());

                  this .onload ?.({ target: { result: `data:${blob .type};base64,${buffer .toString ("base64")}` }});
                  return;
               }
               else
               {
                  return await readAsDataURL .call (this, ... args);
               }
            };
         }
      },
      configurable: true,
      writable: true,
   },
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
   require:
   {
      value: require,
      configurable: true,
      writable: true,
   },
   // classes
   ... Object .fromEntries ([
      "Blob",
      "FileReader",
      "MutationObserver",
      "ResizeObserver",
   ]
   .map (name => [name,
   {
      value: window [name],
      configurable: true,
      writable: true,
   }])),
   // functions and properties
   ... Object .fromEntries ([
      "atob",
      "customElements",
      "fetch",
      "localStorage",
      "sessionStorage",
   ]
   .map (name => [name,
   {
      value: window [name],
      configurable: true,
      writable: true,
      enumerable: true,
   }])),
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

// 2D Context

const getContext = HTMLCanvasElement .prototype .getContext;

HTMLCanvasElement .prototype .getContext = function (... args)
{
   if (args [0] === "2d")
   {
      const { createCanvas } = require ("canvas");

      const canvas = createCanvas (200, 200);

      return canvas .getContext ("2d");
   }
   else
   {
      return getContext .call (this, ... args);
   }
};

// X_ITE

const
   X3D = require ("x_ite"),
   gl  = require ("nogl");

X3D .createBrowser = function (url, parameter)
{
   const element = window .document .createElement ("x3d-canvas");

   element .setAttribute ("splashScreen",  false);
   element .setAttribute ("notifications", false);
   element .setAttribute ("timings",       false);

   Object .defineProperty (element, "browser",
   {
      value: new X3D .X3DBrowser (element),
      enumerable: true,
   });

   if (arguments .length)
      element .browser .loadURL (url, parameter);

   return element;
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
   "uniform1fv",
   "uniform1i",
   "uniform1iv",
   "uniform2f",
   "uniform2fv",
   "uniform3f",
   "uniform3fv",
   "uniform4f",
   "uniform4fv",
   "uniformMatrix3fv",
   "uniformMatrix4fv",
   "vertexAttribDivisor",
]
.map (name => [name, Function .prototype]));

X3D .Context .create = function (canvas, version, preserveDrawingBuffer, mobile)
{
   return Object .assign (gl (), glFunctions,
   {
      getVersion: function () { return 1; },
   });
};

module .exports = X3D;
