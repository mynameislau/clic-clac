const puppeteer = require('puppeteer');
const chalk = require('chalk');
const NodeEnvironment = require('jest-environment-node');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DIR = path.join('/home/app/tmp', 'jest_puppeteer_global_setup');

class PuppeteerEnvironment extends NodeEnvironment {
  constructor (config) {
    super(config);
  }

  async setup () {
    console.log(chalk.yellow('Setup Test Environment.'));
    await super.setup();

    // get the wsEndpoint
    const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8');
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    // connect to puppeteer
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
      ignoreHTTPSErrors: true
    });
  }

  async teardown () {
    console.log(chalk.yellow('Teardown Test Environment.'));
    await super.teardown();
  }

  runScript (script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;
