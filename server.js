var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var ip = process.env.IP;
var port = process.env.PORT;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(port, ip, function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at ' + ip + ':' + port);
});
