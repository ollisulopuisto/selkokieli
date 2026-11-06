import cheerio from 'cheerio';

import { assertClean } from 'test-helpers';

import { cleanAttributes } from './index';

describe('cleanAttributes($)', () => {
  it('removes style attributes from nodes', () => {
    const $ = cheerio.load(`
      <div>
        <p style="color: red;">What do you think?</p>
      </div>
    `);

    const result = cleanAttributes($('*').first(), $);
    assertClean(
      $.html(result),
      `
      <div>
        <p>What do you think?</p>
      </div>
    `
    );
  });

  it('removes align attributes from nodes', () => {
    const $ = cheerio.load(`
      <div>
        <p style="color: red;" align="center">What do you think?</p>
      </div>
    `);

    const result = cleanAttributes($('*').first(), $);
    assertClean(
      $.html(result),
      `
      <div>
        <p>What do you think?</p>
      </div>
    `
    );
  });

  it('removes javascript: and vbscript: URIs from href and src', () => {
    const $ = cheerio.load(`
      <div>
        <a href="javascript:alert(1)">Click me</a>
        <a href="  JAVASCRIPT:alert(2)">Click me too</a>
        <a href="\x01javascript:alert(3)">Click me three</a>
        <a href="vbscript:msgbox(1)">Click me four</a>
        <img src="javascript:alert('img')" alt="malicious" />
        <a href="https://example.com/safe">Safe link</a>
        <a href="/relative/path">Relative link</a>
        <a href="#section">Hash link</a>
      </div>
    `);

    const result = cleanAttributes($('*').first(), $);
    assertClean(
      $.html(result),
      `
      <div>
        <a>Click me</a>
        <a>Click me too</a>
        <a>Click me three</a>
        <a>Click me four</a>
        <img alt="malicious">
        <a href="https://example.com/safe">Safe link</a>
        <a href="/relative/path">Relative link</a>
        <a href="#section">Hash link</a>
      </div>
    `
    );
  });

  it('removes dangerous data: URIs but retains data:image/ URIs', () => {
    const $ = cheerio.load(`
      <div>
        <a href="data:text/html,<script>alert(1)</script>">Dangerous data link</a>
        <img src="data:image/png;base64,iVBORw0KGgo=" alt="Safe image data" />
        <img src="data:text/html,<script>alert(1)</script>" alt="Dangerous image src" />
      </div>
    `);

    const result = cleanAttributes($('*').first(), $);
    assertClean(
      $.html(result),
      `
      <div>
        <a>Dangerous data link</a>
        <img src="data:image/png;base64,iVBORw0KGgo=" alt="Safe image data">
        <img alt="Dangerous image src">
      </div>
    `
    );
  });

  it('sanitizes dangerous URIs from srcset attributes', () => {
    const $ = cheerio.load(`
      <div>
        <img srcset="javascript:alert(1) 1x" alt="xss1" />
        <img srcset="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg== 1x" alt="xss2" />
        <img srcset="safe.jpg 1x, javascript:alert(2) 2x, data:image/png;base64,iVBORw0KGgo= 3x, data:text/html;base64,xyz 4x" alt="mixed" />
        <img srcset="safe-small.jpg 300w, safe-large.jpg 800w" alt="safe" />
      </div>
    `);

    const result = cleanAttributes($('*').first(), $);
    assertClean(
      $.html(result),
      `
      <div>
        <img alt="xss1">
        <img alt="xss2">
        <img srcset="safe.jpg 1x, data:image/png;base64,iVBORw0KGgo= 3x" alt="mixed">
        <img srcset="safe-small.jpg 300w, safe-large.jpg 800w" alt="safe">
      </div>
    `
    );
  });
});
