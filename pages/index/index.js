//index.js
//获取应用实例
const app = getApp();
import { menuScan } from '../../utils/util.js';
Page({
  data: {
    tabBar: [],
    coord: {
      latitude: 39,
      longitude: 116.04,
    },
    mapctx: null,
  },
  // tabBar函数
  menuBindTap(e) {
    if(e.target.dataset.scan){
      menuScan(['志愿者栽植', '扫一扫', '拍照识别', '从相册选择']);
    }
  },
  recoverLatLng(){
    this.data.mapctx.moveToLocation();
  },
  onLoad: function () {
    app.changeTabBar();
    let mapctx = wx.createMapContext('mapView');
    this.setData({
      mapctx: mapctx,
      tabBar: app.globalData.tabBar,
    })
    mapctx.moveToLocation();
  },
})
