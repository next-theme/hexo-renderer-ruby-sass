const vm = require('vm');

function getProperty(config, name) {
  const context = {
    result: null,
    theme: config
  };
  vm.createContext(context); // Contextify the configect.
  vm.runInContext(`result = theme.${name};`, context);

  return context.result;
}

function evalScript(config, code) {
  const context = {
    result: null,
    theme: config
  };
  vm.createContext(context); // Contextify the configect.
  vm.runInContext(`result = (${code});`, context);

  return context.result;
}

module.exports = {
  getProperty,
  evalScript
};
