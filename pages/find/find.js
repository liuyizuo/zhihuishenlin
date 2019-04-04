// pages/find/find.js
let app = getApp();
import { menuScan } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabBar: [],
    userpic: '',
    username: '',
    ulli: 0,
    trees: [],
    treeType: [],

    authority: 1,
  },
  // tabBar函数
  menuBindTap(e) {
    if (e.target.dataset.scan) {
      menuScan(['志愿者栽植', '扫一扫', '拍照识别', '从相册选择']);
    }
  },
  getTreeLi() {
    let self = this;
    wx.request({
      url: app.globalData.url + '/wx/volunteertrees?openid=' + app.globalData.openid,
      // url: 'https://tree.hzvmap.com/wx/volunteertrees?openid=' + 'oOM0b5H9aWd0FVuxe631hfCKLaDQ',
      header: app.globalData.header,
      success(res) {
        let tree = res.data.content;
        self.setData({
          trees: tree,
        })
      },
    })
  },
  navcert(e) {
    let value = e.currentTarget.dataset.value;
    app.globalData.volunteerTree = {
      No: value.No,
      ZZBM: value.SXM,
      treeType: value.TreeTypeObj.TreeTypeName,
      username: value.Full_Name ? value.Full_Name : app.globalData.userInfo.nickName,
      userunit: value.Duty,
      treepic: value.Photo,
      ZZSJ: '2019年3月5日',
      ZZTime: '2019年3月',
    }
    wx.navigateTo({
      url: '../certificate/certificate?no=' + value.No,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.changeTabBar();
    if (app.globalData.userInfo) {
      this.setData({
        userpic: app.globalData.userInfo.avatarUrl,
        username: app.globalData.userInfo.nickName,
      })
    } else {
      this.setData({
        authority: 0,
      })
    }
    this.requestType();
    this.getTreeLi();
  },
  // 请求树种类型
  requestType() {
    let self = this;
    wx.request({
      url: app.globalData.url + "/tree/treetypes",
      header: app.globalData.header,
      success(res) {
        let arr = [];
        res.data.forEach(item => {
          arr[item.ID] = item;
        })
        self.setData({
          treeType: arr,
        })
        // console.log(arr);
      },
    })
  },
  // 解除账号绑定
  unbind() {
    wx.showModal({
      title: '解除账号绑定',
      content: '是否确认解除该账号的绑定？',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/wx/wxvolunteerunbind?openid=' + app.globalData.dataId.openid,
            success: res => {
              if (res.data.code == 1) {
                wx.showToast({
                  title: '解除绑定成功!',
                  icon: 'success',
                  duration: 1000,
                  success: res => {
                    app.globalData.isVolunteerBind = null;
                    setTimeout(() => {
                      wx.navigateBack({
                        delta: getCurrentPages().length,
                      })
                    }, 1000)
                  }
                });
              } else {
                wx.showToast({
                  title: '解除绑定失败',
                  icon: 'none',
                  duration: 1000,
                });
              }
            },
            fail: e => {
              wx.showToast({
                title: '解除绑定失败',
                icon: 'none',
                duration: 1000,
              });
            }
          })
        }
      }
    })
  },
  cancel() {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  ok(e) {
    app.globalData.userInfo = e.detail.userInfo;
    wx.redirectTo({
      url: '../certlist/certlist',
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