const path = require('path');

const eventToPromise = fn =>
  new Promise((resolve, reject) => {
    fn(data => {
      resolve(data);
    });
  });

describe('expand tests', () => {
  it('should have the proper aria-expand value', async () => {
    page.goto(`file://${path.resolve('./index.html')}`);
    expect.assertions(2);

    await eventToPromise(page.on.bind(page, ['load']));

    const expandValue = await page.evaluate(() => {
      return document
        .querySelector('#expand-test')
        .getAttribute('aria-expanded');
    });

    expect(expandValue).toBe('false');

    const newExpandValue = await page.evaluate(async () => {
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      document
        .querySelector('[aria-controls="expand-test"]')
        .dispatchEvent(event);

      const timeoutPromise = time =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, time);
        });

      await timeoutPromise(500);
      return document
        .querySelector('#expand-test')
        .getAttribute('aria-expanded');
    });

    expect(newExpandValue).toBe('true');
  });
});
