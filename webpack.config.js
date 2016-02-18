webpack = require("webpack");

module.exports = {
  entry:["./public/js/angularApp.js",
  "./public/js/controllers/loginCtrl.js",
  "./public/js/controllers/menuCtrl.js",
  "./public/js/controllers/registerCtrl.js",
  "./public/js/controllers/welcomeCtrl.js",
  "./public/js/services/loginSrv.js",
  "./public/js/services/registerSrv.js",
  "./public/js/services/tokenSvc.js",
  "./public/js/services/AuthService.js",
  "./public/js/services/getSvc.js",
  "./public/js/services/createSvc.js",
  "./public/js/services/editSvc.js",
  "./public/js/services/deleteSvc.js",
],
  output:{
    path: __dirname + '/public/js/',
    filename: "bundle.js"
  }
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({minimize: false})
  // ]
  // module:{
  //   loaders:[{
  //     test: /\.jsx?$/,
  //     exclude: [/node_modules/, /bower_components/],
  //     loader: 'babel-loader',
  //     query: {
  //       presets: ['react', 'es2015']
  //     }
  //   }, {
  //     test: /\.css$/,
  //     loader: "style!css"
  //   }]
  // }
};
