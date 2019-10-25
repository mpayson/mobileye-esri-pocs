const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias } = require('customize-cra');
  const path = require('path');

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
      '@layout-header-background': '#2b4269'
    },
  }),
  addWebpackAlias({
    ['@ant-design/icons/lib/dist$']: path.resolve(__dirname, './src/icons.js')
  })
);