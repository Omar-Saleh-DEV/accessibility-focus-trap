const CleanWebpackPlugin = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const entries = {
  'index': './scripts/index.js'
};


const devConfig = {
  mode: 'development',
  name: 'dev',
  entry: entries,
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/scripts'),
    publicPath: './scripts/'
  },
  optimization: {
    minimize: false,
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new AssetsPlugin({
      path: path.resolve(__dirname, 'build/scripts'),
      filename: 'entrypoints.json',
      entrypoints: true
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ["@babel/preset-env"],
      },
    }, {
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"]
    }],
  }
};
const prodConfig = {
  mode: 'production',
  name: 'prod',
  entry: entries,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../scripts'),
    publicPath: './scripts'
  },
  optimization: {
    minimize: true,
    runtimeChunk: {
      name: 'runtime'
    },
    splitChunks: {
      chunks: 'all',
      name: false
    },
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          }
        }
      })
    ]
  },
  plugins: [
    new AssetsPlugin({
      path: './dist/scripts/',
      filename: 'entrypoints.json',
      entrypoints: true
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader',
      query: {
        presets: ["@babel/preset-env"],
      },
    }, {
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"]
    }],
  }
};



module.exports = {
  init: function (prod) {
    return prod ? prodConfig : devConfig;
  }
}
