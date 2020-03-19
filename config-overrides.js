const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias, addWebpackPlugin } = require('customize-cra');
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

const parseEnvVars = () => {
  // call dotenv and it will return an Object with a parsed key 
  const env = dotenv.config().parsed;
  console.log('Using env: ', env);
  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});
  return envKeys
}

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { 
      '@primary-color': '#00abbc',
      '@layout-header-background': '#2b4269',
      '@processing-color': '#00abbc'
    },
  }),
  addWebpackAlias({
    ['@ant-design/icons/lib/dist$']: path.resolve(__dirname, './src/icons.js')
  }),
  addWebpackPlugin(new webpack.DefinePlugin(parseEnvVars()))
);