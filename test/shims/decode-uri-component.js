// decode-uri-component@0.5.1 on ES-moduuli (`export default`), mutta tässä
// projektissa testit ajetaan vanhalla Jest 24 -asetustoiminnolla
// CommonJS:ssä ja transitiiviset kuluttajat (source-map-resolve
// snapdragonin kautta) odottavat purkufunktion suoraan. Ladataan paketti
// Node.js:n omalla requirella (createRequire, ohittaa Jestin transformaation
// ja moduleNameMapperin) ja puretaan oletusvienti.
const { createRequire } = require('module');

const nodeRequire = createRequire(__filename);
const decodeUriComponent = nodeRequire('decode-uri-component');

module.exports =
  decodeUriComponent && decodeUriComponent.default
    ? decodeUriComponent.default
    : decodeUriComponent;
