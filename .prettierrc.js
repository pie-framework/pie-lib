// .prettierrc.js
module.exports = {
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  printWidth: 120,
  semi: true,
  arrowParens: 'always',
  overrides: [
    {
      files: '*.{js,jsx,tsx,ts,scss,json,html}',
      options: {
        tabWidth: 2,
      },
    },
  ],
};
