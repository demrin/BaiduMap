/**
 * create by demrin in 2017/01/19
 * 所建案例以厦门为基础级别
 * @copyright 
 */
(function () {
    var map = new BMap.Map('container', { enableMapClick: false }); //创建地图容器
    var point = new BMap.Point(118.119, 24.510);  //定点（厦门）
    map.centerAndZoom(point, 12)    //初始化地图并设置中心点和地图级别

    //添加控件
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.GeolocationControl());  //定位

    //地图功能
    // map.enableMapClick(false);        //取消景点点击弹出
    map.enableScrollWheelZoom(true);     //设置滚轮放大缩小
    map.enableDragging(true);            //设置地图拖拽

    // 自定义窗口
    var customizeWindow = {
        width: 250,
        height: 250,
        title: '窗口标题'  //可自定义
    }


    //-----行政区域描边开始-----

    //(
    function getAreaStroke() {
        var adminAreas = ['思明区', '湖里区', '海沧区', '集美区', '翔安区', '同安区'];
        for (var i = adminAreas.length - 1; i >= 0; i--) {
            var boundary = new BMap.Boundary();   //获取行政区域边界
            var areaName = adminAreas[i];
            boundary.get(areaName, function (rs) {
                var count = rs.boundaries.length;
                for (var i = 0; i < count; i++) {
                    var ply = new BMap.Polygon(rs.boundaries[i], {
                        strokeWeight: 3,
                        strokeColor: 'red'
                    });
                    ply.setFillOpacity('0.1');   //区域背景透明度
                    map.addOverlay(ply);
                }
            })
        }
    } //()
    //)

    setTimeout(function () {
        getAreaStroke()
    }, 1000);

    //-----行政区域描边结束-----

    (function(){
        var northeast = map.getBounds().getNorthEast();
        var southwest = map.getBounds().getSouthWest();
        console.log(northeast);
        console.log(southwest);
    })()

    //创建区域自定义样式
    function disStrictStyle(id, div, name, count) {
        div.setAttribute('id', 'circle');
        div.innerHTML = '<span class="strictAreaName">' + name + '</span>'
                      + '<span class="count">' + count + '</span>'

        div.addEventListener('click', function () {
            map.centerAndZoom(name, 13)
        })
    }

    function communityStyle(id, div, name, count) {
        div.setAttribute('id', 'square');
        div.innerHTML = '<span class="communityName">' + name + '</span>'
                      + '<span class="count">' + count + '</span>'
    }

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
        var div = this._div = document.createElement('div');

        //以下为执行自定义功能
        if (map.getZoom() < 15) {
            // disStrictStyle(id,div,name,count) 区域样式函数
            disStrictStyle(this._id, div, this._name, this._count)
        }
        map.getPanes().markerPane.appendChild(div);
        return div
    }
    // 实现绘制方法   
    myOverlay.prototype.draw = function () {
        // 根据地理坐标转换为像素坐标，并设置给容器    
        var position = this._map.pointToOverlayPixel(this._center);
        this._div.style.left = position.x - this._length / (1) + "px";
        this._div.style.top = position.y - this._length / (4) + "px";
    }

    //添加自定义覆盖物
    var myLay = new myOverlay('kjalsfd1234d3001', map.getCenter(118.120, 24.510), '海沧', 6, 200, "red");
    map.addOverlay(myLay);
    console.log(myLay)
    //-----自定义覆盖物 构造函数结束-----
})()