const path = require('path');

const eventToPromise = fn =>
  new Promise((resolve, reject) => {
    fn(data => {
      resolve(data);
    });
  });

describe('errors', () => {
  it('should load without error', async () => {
    page.goto(`file://${path.resolve('./index.html')}`);
    expect.assertions(1);

    let errors = false;
    page.on('pageerror', msg => {
      errors = true;
    });

    await eventToPromise(page.on.bind(page, ['load'])).then(() => {
      expect(errors).toEqual(false);
    });
  });
});
