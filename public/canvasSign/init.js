var handSignUtil = {
    color: "3",
    lineWidth: 4,
    canvas: {},
    canvasWrite: {},
    size: {
        width: 0,
        height: 0
    },
    getColorCode: function (colorIndex) {
        let colorArr = ['#FF0000', '#0000FF', '#000000'];
        return colorArr[colorIndex - 1];
    },
    pageshow: function () {
        handSignUtil.size.width = $(document).width();
        handSignUtil.size.height = $(document).height();
        handSignUtil.canvas = document.getElementById('myCanvas');
        var canvasSize = handSignUtil.getCanvasSize();
        handSignUtil.canvasWrite = new canvasWrite(handSignUtil.canvas, canvasSize.width, canvasSize.height);
        handSignUtil.canvasWrite.strokeColor(handSignUtil.getColorCode(handSignUtil.color));
        handSignUtil.canvasWrite.lineWidth(handSignUtil.lineWidth);
    },
    getCanvasSize: function () {
        return {
            width: $('#myCanvas').width(),
            height: $('#myCanvas').height()
        }
    },
    clean: function () {
        handSignUtil.canvasWrite.clean();
    },
    //将canvas转换为图片
    generateSeal: function () {
        var tmpBase64 = handSignUtil.canvas.toDataURL("image/png");
        var canvasSize = handSignUtil.getCanvasSize();
        var tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = canvasSize.height;
        tmpCanvas.height = canvasSize.width;
        var ctx = tmpCanvas.getContext("2d");
        var image = new Image();
        image.src = tmpBase64;
        image.onload = function () {
            ctx.translate(0, canvasSize.width);
            ctx.rotate(-90 * Math.PI / 180);
            ctx.drawImage(image, 0, 0);
            var imageBase64 = tmpCanvas.toDataURL("image/png");
            var sealJson = {
                base64Image: imageBase64,
                sourceType: 2
            };
            var sealInfo = JSON.stringify(sealJson);
            $.ajax({
                url: '/seal/uploadHandSeal',
                type: "POST",
                data: sealInfo,
                dataType: "json",
                contentType: "application/json",
                timeout: 300000,
                error: function (XMLHttpRequest, textStatus, errorThrown) {},
                headers: {
                    "token": urlParse().token
                },
                success: function (data) {
                    $(".bg").hide();
                    console.log(data)
                    if (data["code"] == 200) {
                        $("#hand-sign").hide();
                        $("#successBox").show();
                        console.log(urlParse().wirte == '1')
                        if (urlParse().wirte == '1') {
                            window.history.go(-1)
                        }
                        if (urlParse().from == 'sign') {
                            window.location.href = '../sign/?id=' + urlParse().id + '&taskId=' + urlParse().taskId + '&from=canvasSign';
                        }
                    } else {}
                }
            });
        };
    },
}
handSignUtil.canvasWrite = canvasWrite;
$(document).ready(function () {
    $(".submit").on("tap", function () {
        handSignUtil.generateSeal();
    });
    $(".my-hand-sign-uncheck").on("tap", function () {
        let colorKey = $(this).attr("colorKey");
        if ($(this).hasClass('my-hand-sign-check')) {
            return;
        }
        $('.my-hand-sign-check').removeClass('my-hand-sign-check');
        $('.my-hand-sign-check-div:eq(2)').removeClass('my-hand-sign-check-div-red')
        $('.my-hand-sign-check-div:eq(1)').removeClass('my-hand-sign-check-div-blue')
        $('.my-hand-sign-check-div:eq(0)').removeClass('my-hand-sign-check-div-black')
        $(this).addClass('my-hand-sign-check');
        if (colorKey == '1') {
            $('.my-hand-sign-check-div:eq(2)').addClass('my-hand-sign-check-div-red')
        }
        if (colorKey == '2') {
            $('.my-hand-sign-check-div:eq(1)').addClass('my-hand-sign-check-div-blue')
        }
        if (colorKey == '3') {
            $('.my-hand-sign-check-div:eq(0)').addClass('my-hand-sign-check-div-black')
        }
        handSignUtil.color = colorKey;
        handSignUtil.canvasWrite.strokeColor(handSignUtil.getColorCode(handSignUtil.color));
    });
    $(".my-hand-sign-line").on("tap", function () {
        if ($(this).hasClass('my-hand-sign-line-active')) {
            return;
        }
        $('.my-hand-sign-line').removeClass('my-hand-sign-line-active');
        $(this).addClass('my-hand-sign-line-active');
        handSignUtil.lineWidth = $(this).attr("lineWidth") - 0;
        handSignUtil.canvasWrite.storkelienWidth(handSignUtil.lineWidth);
    });
    $(".clean").on("tap", function () {
        handSignUtil.clean();
    })
});
$("#hand-sign").on("pageshow", function () {
    handSignUtil.pageshow();
});
// 旋转成功的盒子
$(function () {
    $('#successBox').css('width', window.innerHeight + 'px');
    $('#successBox').css('height', window.innerWidth + 'px');
    $('#successBox').css('transform-origin', 'right bottom');
    $('#successBox').css('transform', 'rotate(90deg) translate(' + (window.innerHeight - window.innerWidth) +
        'px,' + window.innerHeight + 'px)');


})