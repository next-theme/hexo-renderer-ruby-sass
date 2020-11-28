const sass = require('sass');
const magicImporter = require('node-sass-magic-importer');
const { getProperty } = require('./utils');
const importer = require('./importer');

module.exports = function(data, options, callback) {
  const config = Object.assign({
    debug         : false,
    outputStyle   : 'compressed',
    sourceComments: false,
    sourceMapEmbed: false
  }, this.config.sass);
  const theme = this.theme.config;
  const { log } = this;

  sass.render({
    ...config,
    data     : data.text,
    file     : data.path,
    importer : [importer(theme), magicImporter()],
    functions: {
      'hexo-config($ckey)': function(ckey) {
        const value = getProperty(theme, ckey.getValue());
        let result;
        if (Array.isArray(value)) {
          result = new sass.types.List(value.length);
          value.forEach((val, i) => {
            result.setValue(i, new sass.types.String(val));
          });
        } else if (typeof value === 'boolean') {
          result = sass.types.Boolean[value ? 'TRUE' : 'FALSE'];
        } else if (typeof value === 'number') {
          result = new sass.types.Number(value);
        } else {
          result = new sass.types.String(value);
        }
        if (config.debug) {
          log.info('hexo-config.' + ckey.getValue(), value);
        }
        return result;
      }
    }
  }, function(err, res) {
    if (err) {
      log.error(err.toString());
      callback(err);
      return;
    }
    callback(null, res.css.toString());
  });
};
