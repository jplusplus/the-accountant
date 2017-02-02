require('babel-polyfill');
const context = require.context('.', true, /\.(js|ts|tsx)$/);
context.keys().forEach(context);
