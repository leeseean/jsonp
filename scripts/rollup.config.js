const path = require('path')
const chalk = require('chalk')
const version = process.env.VERSION || require('../package.json').version
// const alias = require('rollup-plugin-alias')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const { terser } = require('rollup-plugin-terser')
const typescript = require('rollup-plugin-typescript2')

console.log(chalk.red(`\nPackage version :${version}`))

const banner =
  '/*!\n' +
  ' * better-jsonp v' + version + ' Copyrights (c) ' + new Date().getFullYear() + ' Bowen (lbwa)\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const resolve = p => path.resolve(__dirname, '../', p)

const builds = {
  // be used to link with <script>
  'development': {
    entry: resolve('lib/jsonp.ts'),
    dest: resolve('dist/better-jsonp.js'),
    format: 'umd',
    env: 'development',
    banner,
    plugins: []
  },
  // be used to link with <script>
  'production': {
    entry: resolve('lib/jsonp.ts'),
    dest: resolve('dist/better-jsonp.min.js'),
    format: 'umd',
    env: 'production',
    banner,
    plugins: [
      terser({
        output: {
          comments: /^!/
        }
      })
    ]
  }
}

function genConfig (name) {
  const options = builds[name]
  const config = {
    input: options.entry,
    output: {
      file: options.dest,
      format: options.format,
      banner: options.banner,

      // module name in global env. eg. window.jsonp = function () {...}
      name: options.moduleName || 'jsonp'
    },
    plugins: [
      // define aliases and extension which should be resolved
      // alias({
      //   utils: resolve('lib/utils') // url alias, eg. utils -> ../utils
      // }),

      // keep babel plugin behind typescript plugin
      typescript({
        tsconfig: 'tsconfig.json'
      }),

      // convert to lower ES version
      babel({
        exclude: 'node_modules/**'
      }),

      ...options.plugins
    ]
  }

  if (options.env) {
    config.plugins.push(
      // rollup-plugin-replace, be used to inject environment variable to output
      replace({
        exclude: 'node_modules/**',
        ENVIRONMENT: JSON.stringify(options.env)
      })
    )
  }

  return config
}

// start from rollup -c scripts/rollup.config.js --environment TARGET:production
module.exports = genConfig(process.env.TARGET)
