const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
module.exports = {
  mode: mode, // production
  entry: {
    main: path.resolve(__dirname, 'src/js/controller.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: '[name][ext]',
    clean: true,
  },
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 1234,
    open: {
      app: {
        name: 'firefox',
      },
    },
    hot: true,
  },
  //plugins
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Forkify // Search over 1,000,000 recipes',
      filename: 'index.html',
      template: path.resolve(__dirname, 'index.html'),
    }),
  ],
  //loaders
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(svg,ico|png|gif|webp|jpg|jpeg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.svg/,
        use: {
          loader: 'svg-url-loader',
          options: {
            // make all svg images to work in IE
            iesafe: true,
          },
        },
      },
    ],
  },
};
