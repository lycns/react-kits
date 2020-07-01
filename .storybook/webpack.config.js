var getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

module.exports = ({ config }) => {
  config.module.rules.push(
    {
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('awesome-typescript-loader'),
        },
        // Optional
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    },
    {
      test: /\.module.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            sourceMap: true,
            modules: {
              getLocalIdent: getCSSModuleLocalIdent,
            },
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    {
      test: /\.scss$/,
      exclude: /\.module\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  )
  config.resolve.extensions.push('.ts', '.tsx')
  return config
}
