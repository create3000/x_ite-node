
const X3D = require ("..");

// test ("X3D", () =>
// {
//    expect (X3D) .toBeInstanceOf (Object);
// });

// test ("createBrowser", () =>
// {
//    const canvas  = X3D .createBrowser ();
//    const browser = canvas .browser;

//    expect (canvas) .toBeInstanceOf (HTMLElement);
//    expect (browser) .toBeInstanceOf (X3D .X3DBrowser);
// });

// test ("nodes", async () =>
// {
//    const canvas  = X3D .createBrowser ();
//    const browser = canvas .browser;
//    const scene   = browser .currentScene;

//    await browser .loadComponents (browser .getProfile ("Full"));

//    for (const ConcreteNode of browser .concreteNodes)
//       expect (new ConcreteNode (scene)) .toBeInstanceOf (ConcreteNode);
// });

test ("load one example", async () =>
{
   const canvas  = X3D .createBrowser ();
   const browser = canvas .browser;

   await browser .loadComponents (browser .getProfile ("Full"));

   const scene = await browser .createX3DFromURL (new X3D .MFString ("https://create3000.github.io/media/examples/X3D/Approach/Approach.x3d"));

   expect (scene .encoding) .toBe ("XML");
   expect (scene .rootNodes) .not .toHaveLength (0);

   scene .dispose ();
   browser .dispose ();
},
/* min */ 1 * 60 * 1000);

test ("load media examples", async () =>
{
   const
      media    = `https://create3000.github.io/media/examples`,
      response = await fetch (`${media}/config.json`),
      examples = JSON .parse (await response .text ());

   expect (examples) .toBeInstanceOf (Array);

   const canvas  = X3D .createBrowser ();
   const browser = canvas .browser;

   await browser .loadComponents (browser .getProfile ("Full"));

   for (const { name, component } of examples)
   {
      console .log (component, name);

      const scene = await browser .createX3DFromURL (new X3D .MFString (`${media}/${component}/${name}/${name}.x3d`));

      expect (scene .encoding) .toBe ("XML");
      expect (scene .rootNodes) .not .toHaveLength (0);

      scene .dispose ();
   }
},
/* min */ 1 * 60 * 1000);

test ("nodes", async () =>
{
   const canvas  = X3D .createBrowser ();
   const browser = canvas .browser;

   const scene = await browser .createScene (browser .getProfile ("Full"), browser .getComponent ("X_ITE"));

   for (const ConcreteNode of browser .concreteNodes)
      expect (scene .createNode (ConcreteNode .typeName) .getNodeTypeName ()) .toBe (ConcreteNode .typeName);

   scene .dispose ();
   browser .dispose ();
});
