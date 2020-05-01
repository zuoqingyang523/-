import Unidragger from 'unidragger'

function Dragger(elem, parent, onlyMoveY, onlyMoveX, moveCallback, onlyGetMousePositonCallback) {
    this.element = elem;
    this.parment = parent;
    this.onlyMoveY = onlyMoveY;
    this.onlyMoveX = onlyMoveX;
    this.moveCallback = moveCallback;
    this.onlyGetMousePositonCallback = onlyGetMousePositonCallback;

}
$.extend(Dragger.prototype, Unidragger.prototype);
Dragger.prototype.create = function () {
    // set drag handles
    this.handles = [this.element];
    this.bindHandles();
};

Dragger.prototype.dragStart = function (event, pointer) {
    var boxX = this.element.offsetLeft
    var boxY = this.element.offsetTop
    // 获取鼠标所在的坐标
    var mouseX = parseInt(this.getMouseXY(event).x)
    var mouseY = parseInt(this.getMouseXY(event).y)

    // 鼠标相对元素左和上边缘的坐标
    this.offsetX = mouseX - boxX
    this.offsetY = mouseY - boxY
    this.onlyGetMousePositonCallback && this.onlyGetMousePositonCallback(this.offsetX, this.offsetY)
};

Dragger.prototype.dragMove = function (event, pointer, moveVector) {
    if (!this.onlyGetMousePositonCallback) {
        var x = this.getMouseXY(event).x - this.offsetX
        var y = this.getMouseXY(event).y - this.offsetY

        // 计算可移动位置的大小， 保证元素不会超过可移动范围
        // 此处就是父元素的宽度减去子元素宽度
        var width = this.parment.clientWidth - this.element.offsetWidth
        var height = this.parment.clientHeight - this.element.offsetHeight

        // min方法保证不会超过右边界，max保证不会超过左边界

        x = Math.min(Math.max(0, x), width)


        y = Math.min(Math.max(0, y), height)

        // 给元素及时定位
        if (!this.onlyMoveY) {
            this.element.style.left = x + 'px'
        }
        if (!this.onlyMoveX) {
            this.element.style.top = y + 'px'
        }
        if (this.moveCallback) {
            this.moveCallback(x, y, event);
        }
    }

};

Dragger.prototype.dragEnd = function (event, pointer) {
    console.log('drag end');
};
Dragger.prototype.getMouseXY = function (e) {
    var x = 0,
        y = 0
    e = e || window.event

    if (e.pageX) {
        x = e.pageX
        y = e.pageY
    } else {
        x = e.clientX + document.body.scrollLeft - document.body.clientLeft
        y = e.clientY + document.body.scrollTop - document.body.clientTop
    }
    return {
        x: x,
        y: y
    }
}

export default Dragger;