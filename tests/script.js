const X3D = require ("..");

const
   canvas  = X3D .createBrowser (),
   browser = canvas .browser,
   scene   = browser .currentScene;

async function main ()
{
   await browser .loadComponents (browser .getProfile ("Full"));

   // for (const ConcreteNode of browser .concreteNodes)
   //    console .log (ConcreteNode .typeName);

   // for (const ConcreteNode of browser .concreteNodes)
   //    console .log (scene .createNode (ConcreteNode .typeName) .toVRMLString ());
}

main ();
