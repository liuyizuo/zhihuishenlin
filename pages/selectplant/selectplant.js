// pages/selectplant/selectplant.js
const app = getApp();
import { camera } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectItem: {},
    selImg: 'http://static2.xingseapp.com/users/337295/flowers/1476333098.jpg?auth_key=1554277089-0-0-e99f9472f6fec92f51475b790f7581d0',
    indentList: [
      {
        "reference_url": "http://static2.xingseapp.com/users/337295/flowers/1476333098.jpg?auth_key=1554277089-0-0-e99f9472f6fec92f51475b790f7581d0",
        "name": "朴树",
        "family": "榆科",
        "genus": "朴属",
        "desc": "树如其名，不张不扬",
        "probability": 0.20577095448971,
        "detail_url": "http://api.xingseapp.com/item/detail?id=VzlHUmM3ZHBhc0VHNkpUNUJEZXdadzZ5bHI3MHJZSjJEQ3JKOGxkQ1dGTlVFUVpHQ3h5SytDMFBDNnNwZFA5WQ=="
      },
      {
        "reference_url": "http://static2.xingseapp.com/users/89922/flowers/1476349518.jpg?auth_key=1554277089-0-0-8723ec8c098fd62fb6b67e0a504b9fbd",
        "name": "槐花",
        "family": "豆科",
        "genus": "槐属",
        "desc": "春之深爱",
        "probability": 0.14762809872627,
        "detail_url": "http://api.xingseapp.com/item/detail?id=VzlHUmM3ZHBhc0VHNkpUNUJEZXdaMkMzclFEUXpuZ2N4NkFhZFBQNlFrWDUyalpLa2tRUVd0bDRHdWZWVC9OSA=="
      },
      {
        "reference_url": "http://static2.xingseapp.com/users/96489/flowers/1474877652.jpg?auth_key=1554277089-0-0-7192f50dcb0037a5f5f475c5ca2bf67b",
        "name": "乌桕",
        "family": "大戟科",
        "genus": "乌桕属",
        "desc": "未霜乌桕赤，另日海棠红",
        "probability": 0.063666008412838,
        "detail_url": "http://api.xingseapp.com/item/detail?id=VzlHUmM3ZHBhc0VHNkpUNUJEZXdaMkZNMk9hTUwySllscmdYb3pVYjBKUGtjUHNkMG1uT3pjbHlQTDI3eWpnYg=="
      }
    ],
    listIndex: 0,
  },
  changeScroll(e){
    this.setData({
      listIndex: e.detail.current,
      selectItem: this.data.indentList[e.detail.current],
    })
  },
  scrollLeft() {
    this.setData({
      listIndex: this.data.listIndex - 1,
    })
  },
  scrollRight() {
    this.setData({
      listIndex: this.data.listIndex + 1,
    })
  },
  checkDetail(e){
    app.globalData.weburl = e.currentTarget.dataset.item.detail_url
    wx.navigateTo({
      url: '../plantdetail/plantdetail',
    })
  },
  recamera(){
    camera(0);
  },
  rechoose() {
    camera(1);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.identImg == '' || app.globalData.identList.length == 0){
      wx.showToast({
        title: '获取数据失败',
        icon: 'none',
      })
      setTimeout(e=>{
        wx.navigateBack({
          delta: -1,
        })
      }, 1000)
    }
    this.setData({
      selImg: app.globalData.identImg,
      indentList: app.globalData.identList,
      selectItem: app.globalData.identList[0],
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})