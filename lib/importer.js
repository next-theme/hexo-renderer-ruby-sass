const fs = require('fs');
const { getProperty } = require('./utils');

module.exports = function(theme) {
  return (url, file) => {
    if (url.startsWith('hexo-config:')) {
      const name = url.split('hexo-config:')[1];
      const file = getProperty(theme, name);
      if (typeof file === 'string') {
        return {
          file
        };
      } else if (Array.isArray(file)) {
        let contents = file.map(name => fs.readFileSync(name)).join('\n\n');
        return {
          contents
        };
      }
    }
    return {
      contents: null
    };
  };
};
