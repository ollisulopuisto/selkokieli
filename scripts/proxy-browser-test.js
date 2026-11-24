const express = require('express');
const request = require('postman-request');

const app = express();
let server;

const ALLOWED_URLS = [
  'http://www.cnn.com/2016/11/05/middleeast/iraq-mosul-isis-offensive/',
  'https://www.cnn.com/2019/01/30/politics/trump-intel-chiefs-foreign-policy-iran-isis-north-korea/index.html',
];

const start = () => {
  app.use('/:url', (req, res) => {
    const url = req.originalUrl.slice(1);
    const targetUrl = ALLOWED_URLS.find(allowed => allowed === url);

    if (!targetUrl) {
      return res.status(400).send('Bad Request');
    }

    const options = {
      url: targetUrl,
      // Don't set encoding; fixes issues
      // w/gzipped responses
      encoding: null,
      // Accept cookies
      jar: true,
      // Accept and decode gzip
      gzip: true,
      // Follow any redirect
      followAllRedirects: true,
    };
    return req.pipe(request(options)).pipe(res);
  });
  server = app.listen(process.env.PORT || 3000);
};

const stop = () => {
  if (server) {
    server.close();
  }
};

start();
require('child_process').exec(
  `node ./node_modules/karma/bin/karma start ./scripts/karma.conf.js${
    process.env.CI ? ' --CI' : ''
  }`,
  { stdio: [0, 1, 2] },
  (err, stdout) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log('stdout', stdout);
      process.exit(1);
    } else {
      // eslint-disable-next-line no-console
      console.log('stdout', stdout);
    }
    stop();
  }
);
