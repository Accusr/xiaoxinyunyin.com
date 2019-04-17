module.exports = {
  publicPath: './',
  // proxyTable:{
  //   '/api':{
  //     target:'http://localhost:9011',
  //     changeOrigin:true,
  //     pathRewrite:{
  //       '^/api': 'http://localhost:9011',
  //     }
  //   }
  // },
  css:{
    loaderOptions: {
      less: {
        javascriptEnabled:true,
        }

      }
    }
  }
