module.exports = {
  publicPath: '/',


  css:{
    loaderOptions: {
      less: {
        javascriptEnabled:true,
        }

      }
    },

  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
      analyzerPort: 1234
    }
  },

  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined
}
