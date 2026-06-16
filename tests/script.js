const
   X3D  = require (".."),
   path = require ("path"),
   url  = require ("url"),
   fs   = require ("fs");

const
   canvas  = X3D .createBrowser (),
   browser = canvas .browser;

browser .setBrowserOption ("LoadUrlObjects", false);

async function main ()
{
   console .log ("Start test ...");

   await nodes ();
   await box ();
   await svg ();
   await mediaExamples ();

   browser .dispose ();

   console .log ("Finished test ...");
}

async function nodes ()
{
   const scene = await browser .createScene (browser .getProfile ("Full"), browser .getComponent ("X_ITE"));

   // for (const ConcreteNode of browser .concreteNodes)
   //    console .log (ConcreteNode .typeName);

   for (const ConcreteNode of browser .concreteNodes)
      console .log (scene .createNode (ConcreteNode .typeName) .toVRMLString ());
}

async function box ()
{
   const scene = await browser .createX3DFromURL (new X3D .MFString ("https://create3000.github.io/media/examples/Geometry3D/Box/Box.x3d"));

   fs .writeFileSync (path .join (__dirname, "Box.x3dv"), scene .toVRMLString ())
}

async function svg ()
{
   const scene = await browser .createX3DFromURL (new X3D .MFString (url .pathToFileURL (path .join (__dirname, "Primitives.svg"))));

   fs .writeFileSync (path .join (__dirname, "Primitives.x3d"), scene .toXMLString ())
}

async function mediaExamples ()
{
   const
      media    = `https://create3000.github.io/media/examples`,
      response = await fetch (`${media}/config.json`),
      examples = JSON .parse (await response .text ());

   const canvas  = X3D .createBrowser ();
   const browser = canvas .browser;

   await browser .loadComponents (browser .getProfile ("Full"));

   for (const { name, component } of examples)
   {
      console .log (component, name);

      const scene = await browser .createX3DFromURL (new X3D .MFString (`${media}/${component}/${name}/${name}.x3d`));

      scene .dispose ();
   }

   browser .dispose ();
}

main ();
