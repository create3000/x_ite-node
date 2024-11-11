
const X3D = require ("..");

test ("X3D", () =>
{
   expect (X3D) .toBeInstanceOf (Object);
});

test ("createBrowser", () =>
{
   const canvas  = X3D .createBrowser ();
   const browser = canvas .browser;

   expect (canvas) .toBeInstanceOf (HTMLElement);
   expect (browser) .toBeInstanceOf (X3D .X3DBrowser);
});

test ("nodes", async () =>
{
   const canvas  = X3D .createBrowser ();
   const browser = canvas .browser;
   const scene   = browser .currentScene;

   await browser .loadComponents (browser .getProfile ("Full"));

   for (const ConcreteNode of browser .concreteNodes)
      expect (new ConcreteNode (scene)) .toBeInstanceOf (ConcreteNode);
});

test ("load Box", async () =>
{
   const canvas  = X3D .createBrowser ();
   const browser = canvas .browser;
   const scene   = await browser .createX3DFromURL (new X3D .MFString ("https://create3000.github.io/media/examples/Geometry3D/Box/Box.x3d"));

   expect (scene .encoding) .toBe ("XML");
   expect (scene .rootNodes) .toHaveLength (5);
});

test ("load media examples", async () =>
{
   const
      response = await fetch (`https://create3000.github.io/media/examples/config.json`),
      examples = JSON .parse (await response .text ());

   expect (examples) .toBeInstanceOf (Array);

   const canvas  = X3D .createBrowser ();
   const browser = canvas .browser;

   for (const { name, component } of examples)
   {
      const scene = await browser .createX3DFromURL (new X3D .MFString (`https://create3000.github.io/media/examples/${component}/${name}/${name}.x3d`));

      expect (scene .encoding) .toBe ("XML");
      expect (scene .rootNodes) .not .toHaveLength (0);
   }
},
60_000);
