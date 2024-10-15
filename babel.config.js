module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env', // You can specify the import name (default is `@env`)
        path: '.env', // Specify the location of your .env file
        allowUndefined: true, // Allow undefined variables in the .env file
      }]
    ]
  };
};
 