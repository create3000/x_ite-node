// JSDOM

// Restore it later.
const BlobClass = Blob;

require ("jsdom-global") ();

// Preparations

const
   nodeFetch        = require ("node-fetch"),
   { LocalStorage } = require ("node-localstorage"),
   path             = require ("path"),
   url              = require ("url"),
   fs               = require ("fs"),
   os               = require ("os"),
   tmp              = fs .mkdtempSync (path .join (os .tmpdir (), "x_ite"));

process .on ("exit", () =>
{
   fs .rmSync (tmp, { recursive: true });
});

const $ = {
   try (callback, logError = false)
   {
      try
      {
         return callback ();
      }
      catch (error)
      {
         if (logError)
            console .error (error .message);
      }
   },
};

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
   FontFace:
   {
      value: class
      {
         async load () { return this; }
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

         switch (parsedURL .protocol)
         {
            case "file:":
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
            case "data:":
            {
               return new Promise ((resolve, reject) =>
               {
                  const result = parsedURL .href .match (/^\s*data:(.*?)(?:;charset=(.*?))?(?:;(base64))?,/s);

                  if (result)
                  {
                     // const mimeType = result [1] || "text/plain"";

                     let data = parsedURL .href .substring (result [0] .length);

                     data = $.try (() => decodeURIComponent (data)) ?? data;
                     data = Buffer .from (data, result [3] === "base64" ? "base64" : "utf8"); // Decode data.

                     resolve (new Response (data));
                     return;
                  }

                  reject (new Error ("Couldn't parse data: URL."));
               });
            }
            default:
            {
               return nodeFetch (resource, options);
            }
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
   navigator:
   {
      value: { language: "en", languages: [ ] },
      configurable: true,
   },
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
      "FontFace",
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

// Document

Object .defineProperties (document,
{
   fonts:
   {
      value: new Set (),
      configurable: true,
      enumerable: true,
   },
});

// Web Audio Shim

const audioNodes = [
   "AnalyserNode",
   "Audio",
   "AudioBufferSourceNode",
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
   decodeAudioData () { return new AudioNode (); }
   disconnect () { }
   pause () { }
   async play () { }
   async resume () { }
   async start () { }
   stop () { }
   suspend () { }
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
   get playbackRate () { return { } }
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

   get stream ()
   {
      return {
         getAudioTracks: function () { return [ ]; },
         getVideoTracks: function () { return [ ]; },
      };
   }
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

// Video

HTMLMediaElement .prototype .load = Function .prototype;

// XML

global .XMLDocument = window .Document;

// 2D Context

const { Canvas } = require ("skia-canvas");

const getContext = HTMLCanvasElement .prototype .getContext;

HTMLCanvasElement .prototype .getContext = function (contextType, ... args)
{
   if (contextType === "2d")
   {
      const canvas = new Canvas ();

      canvas .toDataURL = canvas .toDataURLSync;

      return Object .assign (canvas .getContext ("2d"),
      {
         drawImage: Function .prototype,
      });
   }
   else
   {
      return getContext .call (this, contextType, ... args);
   }
};

// X_ITE

const
   X3D  = require ("x_ite"),
   nogl = require ("nogl");

X3D .createBrowser = function (url, parameter)
{
   const element = window .document .createElement ("x3d-canvas");

   element .setAttribute ("splashScreen",  false);
   element .setAttribute ("notifications", false);
   element .setAttribute ("timings",       false);

   const browser = new X3D .X3DBrowser (element);

   browser .setBrowserOption ("LoadUrlObjects", false);

   if (arguments .length)
      browser .loadURL (url, parameter);

   return element;
};

const glFunctions = Object .fromEntries ([
   "bindVertexArray",
   "blendEquationSeparate",
   "blendFuncSeparate",
   "blitFramebuffer",
   "copyBufferSubData",
   "copyTexSubImage2D",
   "copyTexSubImage3D",
   "createTransformFeedback",
   "createVertexArray",
   "deleteFramebuffer",
   "drawBuffers",
   "generateMipmap",
   "hint",
   "isEnabled",
   "polygonOffset",
   "readPixels",
   "renderbufferStorageMultisample",
   "texImage3D",
   "transformFeedbackVaryings",
   "uniform1f",
   "uniform1fv",
   "uniform1i",
   "uniform1iv",
   "uniform2f",
   "uniform2fv",
   "uniform2i",
   "uniform2iv",
   "uniform3f",
   "uniform3fv",
   "uniform3i",
   "uniform3iv",
   "uniform4f",
   "uniform4fv",
   "uniform4i",
   "uniform4iv",
   "uniformMatrix2fv",
   "uniformMatrix3fv",
   "uniformMatrix4fv",
   "vertexAttribDivisor",
   "bindTransformFeedback",
   "bindBufferBase",
   "beginTransformFeedback",
   "endTransformFeedback",
]
.map (name => [name, Function .prototype]));

X3D .Context .create = function (canvas, version, preserveDrawingBuffer, mobile)
{
   const
      gl            = nogl (),
      createProgram = gl .createProgram;

   return Object .assign (gl, glFunctions,
   {
      getVersion: () => 2,
      createProgram: () => new Number (createProgram .call (gl)),
   });
};

module .exports = X3D;
