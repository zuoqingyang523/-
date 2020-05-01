import Vue from 'vue';
import Main from './main.vue';
let ConfirmConstructor = Vue.extend(Main);
let instance;
const Message = function (str1, str2, str3, callback1, callback2, close = true, mountedFunction) {
    instance = new ConfirmConstructor({
        data: {
            leftCallback: callback1,
            rightCallBack: callback2,
            close: close,
            content: str1,
            leftButton: str2,
            rightButton: str3,
            mountedFunction: mountedFunction
        }

    });
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
    instance.vm.visible = true;
    instance.dom = instance.vm.$el;
    instance.dom.style.zIndex = 9000;
    return instance.vm;
};
export default Message;