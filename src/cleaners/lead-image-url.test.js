import assert from 'assert';

import clean from './lead-image-url';

describe('clean(leadImageUrl)', () => {
  it('returns the url if valid', () => {
    const url = 'https://example.com';
    assert.equal(clean(url), url);
  });

  it('returns null if the url is not valid', () => {
    assert.equal(clean('this is not a valid url'), null);
  });

  it('trims whitespace', () => {
    const url = '  https://example.com/foo/bar.jpg';
    assert.equal(clean(url), url.trim());
  });

  it('returns null for empty, non-string, or null inputs', () => {
    assert.equal(clean(''), null);
    assert.equal(clean('   '), null);
    assert.equal(clean(null), null);
    assert.equal(clean(undefined), null);
    assert.equal(clean({}), null);
    assert.equal(clean(123), null);
  });

  it('rejects dangerous or invalid protocols', () => {
    const dangerousUrls = [
      'javascript' + ':alert(1)', // eslint-disable-line no-script-url, no-useless-concat
      'vbscript:msgbox(1)',
      'file:///etc/passwd',
      'ftp://example.com/image.jpg',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
      '//cdn.example.com/image.jpg',
      'http://',
      'https://',
    ];

    dangerousUrls.forEach(dangerousUrl => {
      assert.equal(clean(dangerousUrl), null);
    });
  });

  it('accepts valid http and https URLs regardless of case', () => {
    assert.equal(
      clean('http://example.com/pic.jpg'),
      'http://example.com/pic.jpg'
    );
    assert.equal(
      clean('https://example.com/pic.jpg?w=100&h=100'),
      'https://example.com/pic.jpg?w=100&h=100'
    );
    assert.equal(
      clean('HTTP://EXAMPLE.COM/PIC.JPG'),
      'HTTP://EXAMPLE.COM/PIC.JPG'
    );
  });
});
