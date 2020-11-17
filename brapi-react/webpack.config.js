const { join, resolve } = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin      = require('html-webpack-plugin');
const MiniCssExtractPlugin   = require('mini-css-extract-plugin');
const { EnvironmentPlugin }  = require('webpack');


// Declare whether we are in a production environment
const prod = process.env.NODE_ENV === 'production';

module.exports = {

  /* BASE CONFIG */

  mode: prod
    ? 'production'
    : 'development',

  stats: {
    children: false,
    entrypoints: false,
    modules: false,
  },

  devtool: prod
    ? 'source-map'
    : 'cheap-module-eval-source-map',

  entry: resolve(__dirname, './src/index.jsx'),

  output:
  {
    path: resolve(__dirname, './dist'),
    publicPath: process.env.BASE_URL || '/',

    filename: prod
      ? '[name].[contenthash].js'
      : '[name].[hash].js',

  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/'),
    },
    extensions: ['.js', '.json', '.jsx' ],
  },

  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'hashed',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      },
    },
  },

  /* DEV SERVER */

  devServer: {
    clientLogLevel: 'warn',
    historyApiFallback: true,
    hot: true,
    inline: true,
    overlay: true,
    stats: 'minimal',
    host: '0.0.0.0',
    port: process.env.PORT,
  },


  /* PLUGINS */

  plugins: [

    // Clean dist/ folder
    new CleanWebpackPlugin(),

    // Safe environment variables
    new EnvironmentPlugin({
      'NODE_ENV': 'development',
      'BASE_URL': '/',
      'PORT': 8080,
      'GRAPHQL_SERVER': 'http://localhost:3000/graphql',
      'LOGIN_URL': 'http://localhost:3000/login',
    }),

    // Generate dist/index.html
    new HTMLWebpackPlugin({
      favicon: 'public/favicon.ico',
      template: join(__dirname, 'public/index.html'),
      title: process.env.APP_NAME || 'webpack',
    }),

    // Bundle styles in separate *.css files
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),

  ],

  /* RULES */

  module: {

    rules: [

      // *.css
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !prod,
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
        ],
      },

      // *.png
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader',
          options: { limit: 8192 },
        },
      },

      // *.jsx?
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },

    ]
  }
};