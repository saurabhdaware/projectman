function green(message){
    return `\u001b[32m${message}\u001b[39m`;    
}

function boldGreen(message){
    return `\u001b[1m\u001b[32m${message}\u001b[39m\u001b[22m`;
}

function boldRed(message){
    return `\u001b[1m\u001b[31m${message}\u001b[39m\u001b[22m`;
}

function yellow(message){
    return `\u001b[33m${message}\u001b[39m`;
}

function boldYellow(message){
    return `\u001b[1m\u001b[33m${message}\u001b[39m\u001b[22m`;
}

function grey(message){
    return `\u001b[90m${message}\u001b[39m`;
}

function boldGrey(message){
    return `\u001b[1m\u001b[90m${message}\u001b[39m\u001b[22m`;
}

module.exports = {green, boldGreen, boldRed, yellow, boldYellow, grey, boldGrey};