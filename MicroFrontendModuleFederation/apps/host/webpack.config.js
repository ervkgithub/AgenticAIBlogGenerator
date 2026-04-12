const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/bootstrap.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'host.js',
    publicPath: 'auto',
    clean: true,
  },
  devServer: {
    port: 4000,
    historyApiFallback: true,
    static: path.resolve(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'host.js',
      remotes: {
        marketing: 'marketing@http://localhost:4001/remoteEntry.js',
        catalog: 'catalog@http://localhost:4002/remoteEntry.js',
        checkout: 'checkout@http://localhost:4003/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^18.0.0' },
        '@mf/shared': { singleton: true, eager: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
