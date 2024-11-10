
const X3D = require ("../src/index");

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

   await browser .loadComponents (browser .getProfile ("Full"));

   for (const ConcreteNode of browser .concreteNodes)
      expect (new ConcreteNode ()) .toBeInstanceOf (ConcreteNode);
});
