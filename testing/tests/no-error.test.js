const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');

jest.setTimeout(60000);
const timeout = 30000;

const eventToPromise = fn =>
  new Promise((resolve, reject) => {
    fn(data => {
      resolve(data);
    });
  });

const setIntervalPromise = (fn, ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      fn();
      resolve();
    }, ms);
  });

// test.js
describe('/ (Home Page)', () => {
  let page;
  let startTime;

  beforeAll(async () => {
    const browser = await puppeteer
      .launch({
        executablePath: puppeteer.executablePath(),
        headless: true,
        ignoreHTTPSErrors: true,
        args: [
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-background-networking',
          '--disable-default-apps',
          '--disable-extensions',
          '--disable-gpu',
          '--disable-sync',
          '--disable-translate',
          '--headless',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--hide-scrollbars',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-first-run',
          '--remote-debugging-port=9222',
          '--safebrowsing-disable-auto-update'
        ]
      });

    page = await browser.newPage();

    startTime = performance.now();
    page.goto('https://google.com/');
  });

  it('should load without error', async () => {
    // page.on("console", msg => console.log("PAGE LOG:", msg.text()));
    expect.assertions(1);

    let errors = false;
    page.on('pageerror', msg => {
      console.log('error', msg.text());
      errors = true;
    });

    /*
     * return setIntervalPromise(() => {
     *   expect(true).toEqual(true);
     * }, 1000);
     * const text = await page.evaluate(() => document.body.textContent);
     */
    await eventToPromise(page.on.bind(page, ['load'])).then(data => {
      console.log(
        'load time : ',
        (performance.now() - startTime) / 1000,
        'seconds'
      );
      console.log('page loaded');
      expect(errors).toEqual(false);
    });

    // expect(text).toContain("google");
  });
});

/*
 * test("logo has alt", async () => {
 *   let page;
 *   beforeAll(async () => {
 *     page = await global.__BROWSER__.newPage();
 *     await page.goto("http://www.energizeyourdevice.com/fr/accueil/");
 *   });
 *   it("has no errors", async () => {
 *     page.on("error", stuff => {
 *       console.log("error !!!", stuff);
 *       errors = true;
 *     });
 *     await eventToPromise(page.once.bind(page, ["load"]));
 *     expect(errors).toBe(false);
 *   });
 * });
 */
