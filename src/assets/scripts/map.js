export default {
  init: function (ak) {
    const AK = ak
    const BMap_URL = 'https://api.map.baidu.com/api?v=2.0&ak='+ AK +'&s=1&callback=onBMapCallback'
    return new Promise((resolve, reject) => {
      if (typeof BMap !== 'undefined') {
        resolve(BMap)
        return true
      }
      window.onBMapCallback = function () {
        console.log('百度地图脚本初始化成功...')
        resolve(BMap)
      }
      let scriptNode = document.createElement('script')
      scriptNode.setAttribute('type', 'text/javascript')
      scriptNode.setAttribute('src', BMap_URL)
      document.body.appendChild(scriptNode)
    })
  },
}
