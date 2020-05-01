function canvasWrite(canvas, width, height, lineWidth, strokeStyle) {
    canvas.width = width;
    canvas.height = height;
    var drawingBoard = canvas.getContext('2d');
    //轨道
    var orbit = [];
    //是否是移动中的状态
    var isMoving = false;
    var pre = null;
    initDrawingBoard();
    //初始化 canvas画板信息
    function initDrawingBoard() {
        drawingBoard.lineCap = 'round';
        drawingBoard.lineJoin = 'round';
        drawingBoard.lineWidth = lineWidth || 5;
        drawingBoard.strokeStyle = strokeStyle || "#0000ff";
    }

    function beginTouch(event) {
        event.preventDefault();
        pre = getTouchPostion(event);
        isMoving = true;
    }

    function touching(event) {
        event.preventDefault();
        if (!isMoving) return;
        var current = getTouchPostion(event);
        if (pre != null) {
            Draw(pre.x, pre.y, current.x, current.y)
            $('#disable').css('display', 'none');
            $('.submit').css('display', 'block');
            orbit.push({
                start: pre,
                end: current
            });
        }
        pre = current;
    }

    function endTouch(event) {
        isMoving = false;
        event.preventDefault();
        pre = null;
    }

    function Draw(beginX, beginY, endX, endY) {
        drawingBoard.beginPath();
        drawingBoard.moveTo(beginX, beginY);
        drawingBoard.lineTo(endX, endY);
        drawingBoard.stroke()
    }

    function getTouchPostion(event) {
        return {
            x: event.touches[0].pageX - event.target.offsetLeft,
            y: event.touches[0].pageY - event.target.offsetTop
        };
    }
    this.save = function () {
        return canvas.toDataURL();
    }
    this.clean = function () {
        drawingBoard.clearRect(0, 0, canvas.width, canvas.height);
        orbit = [];
        $('#disable').css('display', 'block');
        $('.submit').css('display', 'none');
    }
    this.lineWidth = function (lineWidth) {
        drawingBoard.lineWidth = lineWidth;
    }
    this.reStroke = function () {
        drawingBoard.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < orbit.length; i++) {
            var start = orbit[i].start;
            var end = orbit[i].end;
            Draw(start.x, start.y, end.x, end.y)
        }
    }
    this.strokeColor = function (strokeStyle) {
        drawingBoard.strokeStyle = strokeStyle;
        this.reStroke();
    }
    this.storkelienWidth = function (lineWidth) {
        drawingBoard.lineWidth = lineWidth;
        this.reStroke();
    }
    this.setSize = function (width, height) {
        canvas.width = width;
        canvas.height = height;
    }
    canvas.addEventListener('touchstart', beginTouch, false);
    canvas.addEventListener('touchmove', touching, false);
    canvas.addEventListener('touchend', endTouch, false);
}