module.exports = (api) => {
  const isTest = api.env('test');

  return {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-transform-export-namespace-from',
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: false,
        },
      ],
    ],
    // Don't ignore node_modules in test mode so ES modules can be transformed
    ignore: isTest ? ['packages/**/lib'] : ['node_modules', 'packages/**/lib'],
    sourceMaps: true,
  };
};
