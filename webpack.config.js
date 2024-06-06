import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },

      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },

      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new ESLintPlugin({
      extensions: ['js'],
    }),
  ],
  output: {
    clean: true,
  },
  devServer: {
    static: {
      directory: resolve(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
  },
};
