module.exports = {
  // Остальная конфигурация Webpack...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
        exclude: /node_modules\/firebase/, // Исключить Firebase
      },
    ],
  },
  devtool: false, // Отключение генерации исходных карт в целом
};
