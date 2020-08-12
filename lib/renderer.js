const sass = require('node-sass');
const magicImporter = require('node-sass-magic-importer');

function getProperty(obj, name) {
  name = name.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');

  const split = name.split('.');
  let key = split.shift();

  if (!Object.prototype.hasOwnProperty.call(obj, key)) return '';

  let result = obj[key];
  const len = split.length;

  if (!len) return result || '';
  if (typeof result !== 'object') return '';

  for (let i = 0; i < len; i++) {
    key = split[i];
    if (!Object.prototype.hasOwnProperty.call(result, key)) return '';

    result = result[split[i]];
    if (typeof result !== 'object') return result;
  }

  return result;
}

module.exports = function(data, options, callback) {
  const config = Object.assign({
    debug         : false,
    outputStyle   : 'nested',
    sourceComments: false
  }, this.config.node_sass);
  const self = this;

  sass.render({
    ...config,
    data     : data.text,
    file     : data.path,
    importer : magicImporter(),
    functions: {
      "hexo-config($ckey)": function(ckey) {
        const val = getProperty(self.theme.config, ckey.getValue());
        const sassVal = new sass.types.String(val);
        if (config.debug) {
          self.log.info('hexo-config.' + ckey.getValue(), val);
        }
        return sassVal;
      }
    }
  }, function(err, res) {
    if (err) {
      self.log.error(err.toString());
      callback(err);
      return;
    }
    callback(null, res.css.toString());
  });
};
