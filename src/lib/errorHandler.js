export default {
    install(Vue) {
        const errorHandler = (error, vm) => {
            errorLog(
                error
            )
        }
        Vue.config.errorHandler = errorHandler;
        Vue.config.warnHandler = function (msg, vm, trace) {
            warnLog(msg, trace);
        }
        window.onerror = errorHandler
    }
}