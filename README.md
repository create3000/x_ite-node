# x_ite-node

This is a wrapper for [X_ITE](https://create3000.github.io/x_ite/) for use in a plain Node.js environment. The purpose of this module is to provide a version of X_ITE that can load X3D files, modify or process them, and generate X3D files.

There is no way to render images or anything like that, use [X_ITE in an Electron environment](https://create3000.github.io/x_ite/how-to-use-x-ite-with-electron/) for that.

## Installation

```sh
npm i x_ite-node
```

## Usage

```js
const
   X3D     = require ("x_ite-node"),
   canvas  = X3D .createBrowser (),
   browser = canvas .browser,
   scene   = browser .currentScene;

async function main ()
{
   // Add and load required profile and components:

   scene .setProfile (browser .getProfile ("Interchange"));
   scene .addComponent (browser .getComponent ("Interpolation", 1));

   await browser .loadComponents (scene);

   // Create and add some nodes:

   scene .rootNodes .push (scene .createNode ("Transform"));
   ...

   // Generate XML file:

   console .log (scene .toXMLString ());
}

main ();
```

## See Also

* [X_ITE](https://create3000.github.io/x_ite/)
