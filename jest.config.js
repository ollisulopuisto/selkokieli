module.exports = {
  // decode-uri-component@0.5.1 on ES-moduuli (`export default`), jota tämä
  // projektin vanha Jest 24 -asetustoiminto ei pysty lataamaan sellaisenaan
  // node_modules-kansiosta. source-map-resolve (snapdragonin kautta, jota
  // Jestin expect-kirjasto käyttää) odottaa vastaanottavansa purkufunktion
  // suoraan, joten ohjataan paketin testausten ajalta yhteensopivuusshimille.
  moduleNameMapper: {
    '^decode-uri-component$': '<rootDir>/test/shims/decode-uri-component.js',
  },
};
