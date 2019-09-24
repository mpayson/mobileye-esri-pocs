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
    // modifyVars: { '@primary-color': '#1DA57A' },
  }),
  addWebpackAlias({
    ['@ant-design/icons/lib/dist$']: path.resolve(__dirname, './src/icons.js')
  })
);