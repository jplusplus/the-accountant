require('babel-polyfill');
const context = require.context('.', true, /\.spec\.(js|ts|tsx)$/);
context.keys().forEach(context);
