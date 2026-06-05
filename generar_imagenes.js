const puppeteer = require("puppeteer");
const path = require("path");

const htmlPath = path.resolve(__dirname, "Dashboard_Semanal_Mayo_8.html");

async function screenshot(viewport, outName) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto("file://" + htmlPath, { waitUntil: "networkidle0", timeout: 15000 });

  await page.waitForFunction(() => {
    const canvases = document.querySelectorAll("canvas");
    return canvases.length > 0 && Array.from(canvases).every(c => c.width > 0);
  }, { timeout: 10000 });

  await new Promise(r => setTimeout(r, 1500));

  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ ...viewport, height: bodyHeight + 20 });

  const outPath = path.resolve(__dirname, outName);
  await page.screenshot({ path: outPath, fullPage: true });
  await browser.close();
  console.log(`OK: ${outName} (${viewport.width}x${bodyHeight})`);
}

(async () => {
  await screenshot(
    { width: 1440, height: 1100, deviceScaleFactor: 1 },
    "Dashboard_Semanal_Mayo_8_desktop.png"
  );
  await screenshot(
    { width: 390, height: 1800, deviceScaleFactor: 2 },
    "Dashboard_Semanal_Mayo_8_mobile.png"
  );
})();
