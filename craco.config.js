const CracoAlias = require('craco-alias');
module.exports = {
  plugins: [{
    plugin: CracoAlias,
    options: {
      source: 'tsconfig',
      tsConfigPath: 'tsconfig.paths.json'
    }
  }],
  eslint: {
    enable: true,
    mode: 'extends',
    configure: {
      rules: {
        'default-case': 0
      }
    },
  }
}