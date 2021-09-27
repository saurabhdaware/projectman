const { isURL } = require('../lib/helper');

describe('helper', () => {
  test('#isURL()', () => {
    // Links
    expect(isURL('https://www.google.com')).toBe(true);
    expect(isURL('https://www.data.gov.in')).toBe(true);
    expect(isURL('http://facebook.com')).toBe(true);
    expect(isURL('http://github.com')).toBe(true);

    // Not Links
    expect(isURL('helloworld')).toBe(false);
    expect(isURL('htts://www.google.com')).toBe(false);
    expect(isURL('hats://facebook')).toBe(false);
    expect(isURL('blablabla.com')).toBe(false);
  });
});
