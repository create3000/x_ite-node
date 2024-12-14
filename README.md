# x_ite-node

This is a wrapper for [X_ITE](https://create3000.github.io/x_ite/) for use in a plain Node.js environment. The purpose of this module is to provide a version of X_ITE that can load X3D files, modify or process them, and generate X3D files.

There is no way to render images or anything like that, use [X_ITE in an Electron environment](https://create3000.github.io/x_ite/how-to-use-x-ite-with-electron/) for that.

## Installation

```sh
npm i x_ite-node
```

## Usage

```js
const X3D = require ("x_ite-node");

async function main ()
{
   // Create browser and scene:

   const
      canvas  = X3D .createBrowser (),
      browser = canvas .browser,
      scene   = await browser .createScene (browser .getProfile ("Interchange"), browser .getComponent ("Interpolation", 1));

   // Create and add some nodes to scene:

   scene .rootNodes .push (scene .createNode ("Transform"));
   ...

   // Generate XML file:

   console .log (scene .toXMLString ());
}

main ();
```

Useful information on how to access the external browser and documentation of all X_ITE functions can be found via the following links:

* [External Browser](https://create3000.github.io/x_ite/accessing-the-external-browser/)
* [Scripting Reference](https://create3000.github.io/x_ite/reference/ecmascript-object-and-function-definitions/)
* [Components](https://create3000.github.io/x_ite/components/overview/)

## See Also

* [X_ITE](https://create3000.github.io/x_ite/) - X3D Browser
* [x3d-traverse](https://www.npmjs.com/package/x3d-traverse) - traverse X3D scene graph
