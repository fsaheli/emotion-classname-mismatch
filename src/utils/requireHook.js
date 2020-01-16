// This allows us to import non-js files. If there is any missing extension, just add it here.
// This is meant for dev mode and tests, not for production (webpack will deal with those imports in prod).
// It will replace the import url with the name-hash.extension url and it will also emit the file to the /dist folder
// see docs here: https://github.com/aribouius/asset-require-hook
require('asset-require-hook')({
  extensions: ['jpg', 'png', 'eot', 'woff', 'ttf', 'svg', 'otf'],
  name: '[name]-[hash].[ext]',
  publicPath: `/`,
});
