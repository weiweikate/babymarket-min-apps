
class Touches {
    constructor() {
        this.isVertical = false;
    }

    _getIndex(e) {  // 获取滑动列表的下标值
        return e.currentTarget.dataset.index
    }

    _getMoveX(e, startX) {  // 获取滑动过程中滑动的距离
        return this.getClientX(e) - startX
    }

    _getMoveY(e, startY) {  // 获取滑动过程中滑动的距离
        return this.getClientY(e) - startY
    }

    _getEndX(e, startX) {  // 获取滑动结束滑动的距离
        let touch = e.changedTouches
        if (touch.length === 1) {
            return touch[0].clientX - startX
        }
    }

    _resetData(dataList) {  // 重置数据， 把所有的列表 left 置为 0
        for (let i in dataList) {
            dataList[i].left = 0
        }
        return dataList
    }

    getClientX(e) {  // 获取滑动的横坐标
        let touch = e.touches
        if (touch.length === 1) {
            let t = touch[0];
            return t.clientX
        }
    }

    getClientY(e) {  // 获取滑动的横坐标
        let touch = e.touches
        if (touch.length === 1) {
            let t = touch[0];
            return t.clientY;
        }
    }

    touchM(e, dataList, startX, startY) {  // touchmove 过程中更新列表数据
        let list = this._resetData(dataList)
        let moveX = this._getMoveX(e, startX);
        let moveY = this._getMoveY(e, startY);
        if (Math.abs(moveX) < Math.abs(moveY)) {
            this.isVertical = true;
        }
        if (moveX >= 0 || this.isVertical) {
            return list;
        }
        list[this._getIndex(e)].left = moveX;
        return list
    }

    touchE(e, dataList, startX, width) {  // touchend 更新列表数据
        let list = this._resetData(dataList)
        let disX = this._getEndX(e, startX)
        let left = 0

        if (disX < 0) {  // 判断滑动方向， （向左滑动）
            // 滑动的距离大于删除宽度的一半就显示操作列表 否则不显示
            Math.abs(disX) > width / 2 ? left = -width : left = 0
        } else {  // 向右滑动复位
            left = 0
        }
        if (disX >= 0 || this.isVertical) {
            return list;
        }
        list[this._getIndex(e)].left = left
        return list
    }

    deleteItem(e, dataList) {  // 删除功能
        dataList.splice(this._getIndex(e), 1)
        return dataList
    }
}

export default Touches