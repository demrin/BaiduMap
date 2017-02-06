/**
 * create by demrin in 2017/01/19
 * 所建案例以厦门为基础级别
 * @copyright 
 */
var map = new BMap.Map('container', { enableMapClick: false }); //创建地图容器
var point = new BMap.Point(118.119, 24.510);  //定点（厦门）
map.centerAndZoom(point, 12)    //初始化地图并设置中心点和地图级别

//添加控件
map.addControl(new BMap.NavigationControl());
map.addControl(new BMap.GeolocationControl());  //定位

//地图功能
// map.enableMapClick(false);          //取消景点点击弹出
map.enableScrollWheelZoom(true);    //设置滚轮放大缩小

// 自定义窗口
var customizeWindow = {
    width: 250,
    height: 250,
    title: '窗口标题'  //可自定义
}


//-----行政区域描边开始-----

//(
function getAreaStorke() {
    var adminAreas = ['思明区', '湖里区', '海沧区', '集美区', '翔安区', '同安区'];
    for (var i = adminAreas.length - 1; i >= 0; i--) {
        var boundary = new BMap.Boundary();   //获取行政区域边界
        var areaName = adminAreas[i];
        boundary.get(areaName, function (rs) {
            var count = rs.boundaries.length;
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {
                    storkeWeight: 3,
                    storkeColor: 'red'
                });
                ply.setFillOpacity('0.1');   //区域背景透明度
                map.addOverlay(ply);
            }
        })
    }
} //()
//)

setTimeout(function () {
    getAreaStorke()
}, 1000);

//-----行政区域描边结束-----

//-----创建模块样式-----

//创建区域自定义样式
function disStrictStyle(id, div, name, count) {
    div.setAttribute('id', 'circle');
    div.innerHTML = '<span class="strictAreaName">' + name + '</span>'
        + '<span class="count">' + count + '</span>'
}

function communityStle(id, div, name, count) {

}

//-----创建模块样式-----

//-----自定义覆盖物 构造函数开始-----
function myOverlay(id, center, name, count, length, color) {
    this._id = id;
    this._center = center;
    this._name = name;
    this._count = count;
    this._length = length;
    this._color = color
}
// 继承API的BMap.Overlay
myOverlay.prototype = new BMap.Overlay()
// 实现初始化方法
myOverlay.prototype.initialize = function (map) {
    this._map = map;
    // 创建div元素，作为自定义覆盖物的容器  
    // var div = this._div = document.createEvent('div');
    disStrictStyle()

    //以下为执行自定义功能
    if (map.getZoom() < 15) {
        disStrictStyle(this._id, div, this._name, this._count)
    }
    map.getPanes().markerPaner.appendChild(div);
    return div
}
// 实现绘制方法   
myOverlay.prototype.draw = function () {
    // 根据地理坐标转换为像素坐标，并设置给容器    
    var position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = position.x - this._length / 2 + "px";
    this._div.style.top = position.y - this._length / 2 + "px";
}

//添加自定义覆盖物
var myLay = new myOverlay(map.getCenter(), 100, "red");
map.addOverlay(myLay);
//-----自定义覆盖物 构造函数结束-----