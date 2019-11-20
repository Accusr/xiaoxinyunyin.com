/**
 * 给商品价格加补0
 * @param {*} value
 */
const dateFormat=function(timeStamp){
    let dt = new Date(timeStamp);
    if (timeStamp === undefined) {
            dt = new Date();
        }
        let y = dt.getFullYear();
        let m = dt.getMonth() + 1;
        let d = dt.getDate();
        let h = dt.getHours();
        let min = dt.getMinutes();
        let sec = dt.getSeconds()

        return `${y}-${m}-${d} ${h}:${min}:${sec}`
}

const formatOrderStatus = function(orderStatus){
    switch (orderStatus) {
        case -1:return '订单关闭';
        case 1:return '订单提交';
        case 2:return '支付取消';
        case 3:return '正在出库';
        case 4:return '正在配送';
        case 5:return '确认收货';
        case 6:return '等待评价';
        case 9:return '订单完成';

    }
}
const formatPrice = function (price) {
    return parseFloat(price*0.01).toFixed(2);
}


export default {
    dateFormat,formatOrderStatus,formatPrice
}
