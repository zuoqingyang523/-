import config from './config.js'
console.log(121212121212);
if (config.ENV === 'product') {
    var targetProtocol = "https:";
    if (window.location.protocol != targetProtocol) {
        window.location.href = targetProtocol +
            window.location.href.substring(window.location.protocol.length);
    }
}