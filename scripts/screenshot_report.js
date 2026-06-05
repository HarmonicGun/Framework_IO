const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);

function getArg(name) {
  const idx = args.indexOf(name);
  if (idx === -1 || idx + 1 >= args.length) return null;
  return args[idx + 1];
}

const mode = args.includes('--desktop') ? 'desktop' : args.includes('--mobile') ? 'mobile' : null;
const viewportOnly = args.includes('--viewport-only');
const inputPath = getArg('--input');
const outputPath = getArg('--output');

if (!mode || !inputPath || !outputPath) {
  console.error('Uso: node screenshot_report.js --desktop|--mobile --input <html> --output <jpg>');
  process.exit(1);
}

const absInput = path.resolve(inputPath);
if (!fs.existsSync(absInput)) {
  console.error('ERROR: no existe ' + absInput);
  process.exit(1);
}

const config = {
  desktop: { width: 1920, height: 1080, dpr: 3, quality: 95 },
  mobile:  { width: 390,  height: 844,  dpr: 2, quality: 90 },
}[mode];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setViewport({
    width: config.width,
    height: config.height,
    deviceScaleFactor: config.dpr,
    isMobile: mode === 'mobile',
    hasTouch: mode === 'mobile',
  });

  await page.goto('file://' + absInput, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForFunction(() => {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    return canvases.length === 0 || canvases.every(canvas => canvas.width > 0 && canvas.height > 0);
  }, { timeout: 5000 }).catch(() => {});
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.screenshot({
    path: path.resolve(outputPath),
    type: 'jpeg',
    quality: config.quality,
    fullPage: !viewportOnly,
  });

  console.log(path.resolve(outputPath));
  await browser.close();
})();
