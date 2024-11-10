# x_ite-node

This is a wrapper for X_ITE for use in a plain Node.js environment. The purpose of this module is to provide a version of X_ITE that can load X3D files, modify or process them, and generate X3D files.

There is no way to render images or anything like that, use X_ITE in an Electron environment for that.

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

await browser .loadComponents (browser .getProfile ("Full"));

scene .rootNodes .push (scene .createNode ("Transform"));
...

console .log (scene .toXMLString ());
```
