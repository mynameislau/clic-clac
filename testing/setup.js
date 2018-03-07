const chalk = require('chalk');
const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');

const DIR = path.join('/home/app/tmp', 'jest_puppeteer_global_setup');

module.exports = async function () {
  console.log(chalk.green('Setup Puppeteer'));
  console.log(chalk.green(DIR));
  const browser = await puppeteer.launch({
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

  // store the browser instance so we can teardown it later
  global.__BROWSER__ = browser;

  // file the wsEndpoint for TestEnvironments
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
