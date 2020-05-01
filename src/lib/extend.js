import confirm from '../components/common/confirm/index.js'
$.showConfirm = confirm;
$.showMsg = function (str, callback, close) {
    if (!str) {
        str = "暂时无法处理你的请求，请稍候再试";
    }
    var boht = document.createElement("span");
    document.body.appendChild(boht);
    // $("html,body").css({"height": "100%", "overflow": "hidden"})
    $.preventTouch("touchmove");
    boht.id = "boht";
    var alertHtml =
        '<div id="bg" style="opacity: 0.5;width: 100%;height: 100%;position: absolute;' +
        'top: 0;left: 0;z-index: 10000000;"></div>';
    alertHtml +=
        '<div id="info"' +
        'style="height: 0px;width: 0px;top: 50%;left: 50%;position: fixed; z-index: 10000000;">' +
        '<div id="center" style="background-color: rgba(0,0,0,0.6);border: none; border-color: #dddddd;' +
        "text-shadow: none;-webkit-box-shadow: 0 0 12px rgba(0,0,0,.6); -moz-box-shadow: 0 0 12px rgba(0,0,0,.6);" +
        ' box-shadow: 0 0 12px rgba(0,0,0,.6);position: absolute;margin: -30px -80px; -webkit-border-radius: .6em ;border-radius: .6em ;">';
    // alertHtml += '<strong>提示</strong>';
    alertHtml +=
        '<p style="width: 150px;margin: 8px 7px;text-align: center;color: #fff;font-size: .9em;">' +
        str +
        "</p>";
    // alertHtml += '<a class="closeAlert">确认</a>';
    alertHtml += "</div></div>";
    boht.innerHTML = alertHtml;
    if (!close) {
        setTimeout(function () {
            $.closeAlert();
            // $("html,body").css({"height": "auto", "overflow": "visible"})
            if (callback) {
                callback();
            }
        }, 3000);
        $("#bg").click(function () {
            $.closeAlert();
        });
    }
};
$.closeAlert = function () {
    for (var int = 0; int < 100; int++) {
        if ($("#boht").length > 0) {
            var boht = document.getElementById("boht");
            document.body.removeChild(boht);
            $.recoverTouch("touchmove");
        } else {
            break;
        }
    }
};

$.recoverTouch = function (e) { //恢复屏幕滑动事件
    document.body.addEventListener(e, function (event) {
        event.returnValue = true;
    }, false);
}
$.preventTouch = function (e) {
    //阻止滑动屏幕事件
    document.body.addEventListener(
        e,
        function (event) {
            event.preventDefault();
        },
        false
    );
};