module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      'react-css-modules',
      {
        generateScopedName: '[local]--[hash:base64:8]',
        filetypes: {
          '.less': {
            syntax: 'postcss-less',
          },
        },
      },
    ],
  ],
};
