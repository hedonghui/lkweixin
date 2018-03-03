import BaiduMap from '@/assets/scripts/map'
import Vue from 'vue'
import router from '@/router'
var map = null
var addfixCtrl = null
var addSearchCtrl = null
var addinfoCtrl = null
const initMap = (obj) => {
  if(!obj.ak) return
  let ak = obj.ak,
    icon = obj.icon,
    locationIcon = obj.locationIcon,
    apiurl = obj.apiUrl,
    clickIcon = obj.clickIcon,
    locationControl = obj.locationControl,
    repairControl = obj.repairControl,
    searchRouter = obj.searchRouter,
    infoRouter = obj.infoRouter,
    mapZIndex = obj.mapZIndex

  BaiduMap.init(ak).then((BMap) => {
    map = new BMap.Map('allmap')
    map.centerAndZoom(new BMap.Point(116.404, 39.915), mapZIndex);
    let geolocation = new BMap.Geolocation()
    geolocation.getCurrentPosition(function (r) {
      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), mapZIndex)
        let mk = new BMap.Marker(r.point)
        map.panTo(r.point)
        iconMap(r.point, locationIcon)
        getPoint(apiurl, r.point, icon, clickIcon, repairControl, infoRouter)
        getSearchControl(searchRouter, r.point, r.address.city)
      } else {
        console.log('failed' + this.getStatus())
      }
    }, {enableHighAccuracy: true})
    getAddGeolocationControl(locationControl, mapZIndex)

    // getinfoControl()
    map.addEventListener("click", cloceInfo)
  })
}

//添加点图标
  /*
  * @param：pt - object 经纬度
  * @param: icons - object 图标url和size
  * //后台获取之后的点
  * @param: points - object 定位点的经纬度
  * @param: markers - object ajax获取数据
  * @param: clickIcon - object 点击之后图标url和size,
  * @param: repairControl -object 报修图标配置
  * @param: infoRouter - string 信息跳转链接
  * */
const iconMap = (pt, icons, points, markers, clickIcon, repairControl, infoRouter) => {
  if(typeof pt !== 'object') return
  let point = new BMap.Point(pt.lng, pt.lat)
  let myIcon = new BMap.Icon(icons.url, new BMap.Size(icons.size.width, icons.size.height), {imageSize: new BMap.Size(icons.size.width, icons.size.height)})
  let marker = new BMap.Marker(point, {icon: myIcon})
  marker.disableMassClear()
  map.addOverlay(marker)
  if (points && markers) {
    marker.addEventListener('click', function (e) {
      getWalking(points, pt, clickIcon, markers, infoRouter)
      if(addfixCtrl) {
        map.removeControl(addfixCtrl)
      }
      if(addinfoCtrl) {
        map.removeControl(addinfoCtrl)
      }
      getinfoControl(markers, infoRouter)
      getAddFixControl(repairControl, markers.eId)
    })
  }
}
//循环添加多个点图标
/*
*  @param: point - object  定位点的经纬度
*  @param: markers - object ajax获取的数据
*  @param: icon - object 图标的url和size
*  @param: clickIcon - object 点击之后图标url和size，
*  @param: repairControl -object 报修图标配置
* */
const multiMaker = (point, markers, icon, clickIcon, repairControl, infoRouter) => {
  if(!(markers instanceof Array)) return
  for (let i = 0, max = markers.length; i < max; i++) {
    let pt = {}
    pt.lng = markers[i].longitude
    pt.lat = markers[i].latitude
    iconMap(pt, icon, point, markers[i], clickIcon, repairControl, infoRouter)
  }
  console.log('百度地图创建成功......')
}
//ajax获取后台数据
/*
* @param: apiUrl - string 链接
* @param: pt - object 定位点的经纬度
* @param: icon - object 图标url和size
* @param: clickIcon - object 点击之后图标url和size，
* @param: repairControl -object 报修图标配置
* */
const getPoint = (apiurl, pt, icon, clickIcon, repairControl, infoRouter) => {
  if(apiurl === '' && typeof apiurl !== 'string') return
  Vue.http({
    url: apiurl,
    method: 'POST',
    params: {
      longitude: pt.lng,
      latitude: pt.lat
    }
  }).then((response) => {
    if (response.body.result && response.body.locationsList.length) {
      let markers = response.body.locationsList
      multiMaker(pt, markers, icon, clickIcon, repairControl, infoRouter)
    }
  })
}
//获取步行规划路线
/*
* @param: start-object 定位点的经纬度（及起点）
* @param: end -object 点击图标的经纬度（及终点）
* @param: clickIcon- object 点击之后图标url和size
* @param: markars - object ajax获取数据
* @param: infoRouter - string 信息跳转链接
* */
const getWalking = (start, end, clickIcon, markers, infoRouter) => {
  if(typeof start !== 'object' && typeof end !== 'object') return
  let startPoint = new BMap.Point(start.lng, start.lat)
  let endPoint = new BMap.Point(end.lng, end.lat)
  let walking = new BMap.WalkingRoute(map, {renderOptions: {map: map, autoViewport: true}});
  walking.search(startPoint, endPoint)
  //修改路线的样式
  walking.setSearchCompleteCallback((e) => {
    map.clearOverlays()
    let pts = walking.getResults().getPlan(0).getRoute(0).getPath()
    map.addOverlay(new BMap.Polyline(pts, { strokeColor: '#0CBB8D', strokeWeight: 5, strokeOpacity: 1 }))
  })
  //修改起终点的图标
  walking.setMarkersSetCallback((e) => {
    map.removeOverlay(e[0].marker)
    map.removeOverlay(e[e.length - 1].marker)
    let point = new BMap.Point(end.lng, end.lat)
    let endIcon = new BMap.Icon(clickIcon.url, new BMap.Size(clickIcon.size.width, clickIcon.size.height), {imageSize: new BMap.Size(clickIcon.size.width, clickIcon.size.height)})
    let endmarker = new BMap.Marker(point, {icon: endIcon})
    endmarker.setZIndex(1)
    map.addOverlay(endmarker)
    endmarker.addEventListener('click', function (e) {
      if(addinfoCtrl) {
        map.removeControl(addinfoCtrl)
      }
      getinfoControl(markers, infoRouter)
    })
  })
  walking.setPolylinesSetCallback( (e) => {
    let polyline = e[0]
  })
}

//添加定位控件
const getAddGeolocationControl = (locationControl, mapZIndex) => {
  if(typeof locationControl !== 'object') return
  let offsetVal = locationControl.offset
  let iconVal = locationControl.icon
  function addGeolocationControl () {
      this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT
      this.defaultOffset = new BMap.Size(offsetVal.horizontal, offsetVal.direction)
  }
  addGeolocationControl.prototype = new BMap.Control()

  addGeolocationControl.prototype.initialize = function(map){
    let div = document.createElement('div')
    div.style.cursor = 'pointer'
    div.style.width = iconVal.size.width +  'px'
    div.style.height = iconVal.size.height + 'px'
    div.style.borderRadius = '50%'
    div.style.background = 'url(' + iconVal.url + ')'
    div.style.backgroundSize = '100% 100%'

    div.onclick = function(e){
      let geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), mapZIndex)
          let mk = new BMap.Marker(r.point)
          map.panTo(r.point)
        } else {
          console.log('failed'+this.getStatus())
        }
      }, {enableHighAccuracy: true})
    }
    map.getContainer().appendChild(div)
    return div;
  }
  // 创建控件
  var addGeolocationCtrl = new addGeolocationControl()
  // 添加到地图当中
  map.addControl(addGeolocationCtrl)
}

//添加报修自定义控件
const getAddFixControl = (repairControl, eId) => {
  if(typeof repairControl !== 'object') return
  let offsetVal = repairControl.offset
  let iconVal = repairControl.icon
  let routerUrl = repairControl.routerUrl
  function AddFixControl () {
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT
    this.defaultOffset = new BMap.Size(offsetVal.horizontal, offsetVal.direction)
  }
  AddFixControl.prototype = new BMap.Control()

  AddFixControl.prototype.initialize = function (map) {
    let div = document.createElement('div')
    div.style.cursor = 'pointer'
    div.style.width = iconVal.size.width +  'px'
    div.style.height = iconVal.size.height + 'px'
    div.style.borderRadius = '50%'
    div.style.background = 'url(' + iconVal.url + ')'
    div.style.backgroundSize = '100% 100%'
    div.onclick = function (e) {
      router.push({name: routerUrl, params: {eId: eId}})
    }
    map.getContainer().appendChild(div)
    return div
  }
  // 创建控件
  addfixCtrl = new AddFixControl()
  // 添加到地图当中
  map.addControl(addfixCtrl)
}
//添加搜索自定义控件
const getSearchControl = (searchRouter, pt, city) => {
  if(typeof searchRouter !== 'string') return
  let routerUrl = searchRouter
  function addSearchControl () {
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT
    this.defaultOffset = new BMap.Size(0, 10)
  }
  addSearchControl.prototype = new BMap.Control()

  addSearchControl.prototype.initialize = function (map) {
    let div = document.createElement('div')
    div.appendChild(document.createElement('span'))
    div.appendChild(document.createTextNode('区域查找体检站'))
    div.className = 'seach-control'
    div.style.cursor = 'pointer'
    div.style.zIndex = '31'
    div.onclick = function (e) {
      router.push({name: routerUrl, params: {lng: pt.lng, lat: pt.lat, city: city}})
    }
    map.getContainer().appendChild(div)
    return div
  }
  // 创建控件
  addSearchCtrl = new addSearchControl()
  // 添加到地图当中
  map.addControl(addSearchCtrl)
}
//添加信息自定义控件
const getinfoControl = (markers, infoRouter) => {
  if(typeof markers !== 'object') return
  let titleName = markers.eName
  let distanceVal = markers.distance
  function addinfoControl () {
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT
    this.defaultOffset = new BMap.Size(0, 8)
  }
  addinfoControl.prototype = new BMap.Control()

  addinfoControl.prototype.initialize = function(map){
    let div = document.createElement('div')
    let Img = document.createElement('img')
    let Imgwrap = document.createElement('div')
    let wrap = document.createElement('div')
    let title = document.createElement('p')
    let info = document.createElement('div')
    let locationIcon = document.createElement('i')
    let locatText = document.createElement('span')
    let icon = document.createElement('i')
    div.appendChild(Imgwrap)
    Imgwrap.appendChild(Img)
    div.appendChild(wrap)
    div.appendChild(icon)
    wrap.appendChild(title)
    wrap.appendChild(info)
    info.appendChild(locationIcon)
    info.appendChild(locatText)
    div.id = 'infoControl'
    div.className = 'info-control'
    div.style.cursor = 'pointer'
    div.style.zIndex = '31'
    wrap.className = 'wrap-info'
    Imgwrap.className = 'info-img'
    info.className = 'info-div'
    locationIcon.className = 'location-icon'
    icon.className = 'icon-arrow'

    title.innerHTML = titleName
    locatText.innerHTML = '距离' + distanceVal + 'km'
    Img.src = require('../images/common/baseList.png')

    div.onclick = function (e) {
      e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true
      router.push({name: infoRouter, params: {eId: markers.eId}})
    }
    map.getContainer().appendChild(div)
    return div
  }
  // 创建控件
  addinfoCtrl = new addinfoControl()
  // 添加到地图当中
  map.addControl(addinfoCtrl)
}

//点击地图关闭信息窗口
const cloceInfo = (e) => {
  if(!e) return
  if(!(e.overlay instanceof BMap.Marker) && addinfoCtrl) {
    map.removeControl(addinfoCtrl)
  }
}
export default {
  init (obj) {
    if(typeof obj !== 'object') return
    initMap(obj)
  }
}
