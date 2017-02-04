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


//行政区域描边开始

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
                    ply.setFillOpacity('0.3');   //区域背景透明度
                    map.addOverlay(ply);
                }
            })
        }
    } //()
//)

setTimeout(function () {
    getAreaStorke()
}, 1000);

//行政区域描边结束