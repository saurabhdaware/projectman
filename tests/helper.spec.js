const { isURL } = require('../lib/helper');

const expect = require('chai').expect;

describe('helper', () => {
  it('#isURL()', () => {
    // Links
    expect(isURL('https://www.google.com')).to.be.true;
    expect(isURL('https://www.data.gov.in')).to.be.true;
    expect(isURL('http://facebook.com')).to.be.true;
    expect(isURL('http://github.com')).to.be.true;

    // Not Links
    expect(isURL('helloworld')).to.be.false;
    expect(isURL('htts://www.google.com')).to.be.false;
    expect(isURL('hats://facebook')).to.be.false;
    expect(isURL('blablabla.com')).to.be.false;
  });
});
