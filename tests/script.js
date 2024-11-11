const X3D = require ("..");

const
   canvas  = X3D .createBrowser (),
   browser = canvas .browser,
   scene   = browser .currentScene;

async function main ()
{
   await box ();
}

async function nodes ()
{
   await browser .loadComponents (browser .getProfile ("Full"));

   // for (const ConcreteNode of browser .concreteNodes)
   //    console .log (ConcreteNode .typeName);

   for (const ConcreteNode of browser .concreteNodes)
      console .log (scene .createNode (ConcreteNode .typeName) .toVRMLString ());
}

async function box ()
{
   const scene = await browser .createX3DFromURL (new X3D .MFString ("https://create3000.github.io/media/examples/Geometry3D/Box/Box.x3d"));

   console .log (scene .toVRMLString ())
}

main ();
