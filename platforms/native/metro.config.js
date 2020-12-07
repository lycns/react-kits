const modulePaths = require('./module.js');
const resolve = require('path').resolve;
const fs = require('fs');

// Update the following line if the root folder of your app is somewhere else.
const ROOT_FOLDER = resolve(__dirname);
module.exports = {
  projectRoot: ROOT_FOLDER,
  transformer: {
    getTransformOptions: async () => {
      const moduleMap = {};
      modulePaths.forEach(path => {
        if (fs.existsSync(path)) {
          moduleMap[resolve(path)] = true;
        }
      });
      return {
        transform: {
          preloadedModules: moduleMap,
          experimentalImportSupport: false,
          transform: { inlineRequires: { blacklist: moduleMap } },
        },
      }
    },
  },
};
