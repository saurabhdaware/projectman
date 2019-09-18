exports.green = (message) => `\u001b[32m${message}\u001b[39m`;    

exports.boldGreen = (message) => `\u001b[1m\u001b[32m${message}\u001b[39m\u001b[22m`;

exports.boldRed = (message) => `\u001b[1m\u001b[31m${message}\u001b[39m\u001b[22m`;

exports.yellow = (message) => `\u001b[33m${message}\u001b[39m`;

exports.boldYellow = (message) => `\u001b[1m\u001b[33m${message}\u001b[39m\u001b[22m`;

exports.grey = (message) => `\u001b[90m${message}\u001b[39m`;

exports.boldGrey = (message) => `\u001b[1m\u001b[90m${message}\u001b[39m\u001b[22m`;