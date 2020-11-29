const fs = require('fs');
const { evalScript } = require('./utils');

module.exports = function(theme) {
  return (code, src) => {
    const file = evalScript(theme, code);
    if (typeof file === 'string') {
      return {
        file
      };
    } else if (Array.isArray(file)) {
      const contents = file.map(name => fs.readFileSync(name)).join('\n\n');
      return {
        contents,
        file: file[0]
      };
    }
    return {
      contents: null
    };
  };
};
