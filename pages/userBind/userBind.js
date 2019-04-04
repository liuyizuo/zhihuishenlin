// pages/userBind/userBind.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    idcard: '',
    unit: '',
    phone: '',
  },
  iptname(e) {
    this.setData({
      name: e.detail.value
    })
  },
  iptIdcard(e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  iptunit(e) {
    this.setData({
      unit: e.detail.value
    })
  },
  iptphone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getInfo(e) {
    if (this.data.name == '' || this.data.unit == '' || this.data.phone == ''){
      wx.showToast({
        title: '请输入全部信息',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
    let han = /^[\u4e00-\u9fa5]+$/;
    if (!han.test(this.data.name)) {
      wx.showToast({
        title: '姓名必须为汉字',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
    if (!han.test(this.data.unit)) {
      wx.showToast({
        title: '单位必须为汉字',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
    if (!/^\d{11}$/.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
    let userInfo = e.detail.userInfo;
    this.requestIdcard().then(e => {
      let data = {
        "Nick_Name": userInfo.nickName,
        "OpenID": app.globalData.openid,
        "Full_Name": this.data.name,
        "Unit_Name": this.data.unit,
        "Number": this.data.idcard,
        "Phone": this.data.phone,
        // "WeChatNo": "微信号", //暂无法获取
      }
      wx.request({
        url: app.globalData.url + '/wx/volunteeruserbind',
        data: data,
        method: 'post',
        success: res => {
          if (res.data.code == 1) {
            this.requestSuccess(res.data.msg);
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1500,
            })
          }
        },
        fail: err => {
          wx.showToast({
            title: '授权失败',
            icon: 'none',
            duration: 1500,
          })
        }
      })
    })
  },
  // 身份认证
  requestIdcard(){
    return new Promise((resolve, reject) => {
      let name = '于懿轩'
      let idcard = '500222198105267734'
      wx.request({
        url: 'https://idcert.market.alicloudapi.com/idcard?idCard=' + this.data.idcard + '&name=' + this.data.name,
        type: 'GET',
        header: {
          Authorization: 'APPCODE c091fa7360bc48ff87a3471f028d5645',
        },
        success: res => {
          console.log(res);
          if (res.data.status == '01'){
            resolve();
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1500,
            })
          }
        },
        fail: e=>{
          wx.showToast({
            title: '身份认证失败',
            icon: 'none',
            duration: 1500,
          })
          reject();
        }
      })
    })
  },
  requestSuccess(msg) {
    wx.request({
      url: app.globalData.url + '/system/users?openid=' + app.globalData.openid,
      success: res => {
        app.globalData.userData = res.data.content[0];
        wx.showToast({
          title: msg ? msg : '授权成功!',
          icon: 'success',
          duration: 1000,
          success: res => {
            setTimeout(()=>{
              wx.redirectTo({
                url: '../dateTotal/dateTotal',
              })
            }, 1000)
          }
        })
      }
    })
  },
  navigateGo(){
    
  },
  //解除绑定
  unbind() {
    wx.request({
      url: app.data.url + 'wx/wxunbind?openid=' + app.globalData.dataId.openid,
      success: res => {
        app.globalData.isbind = null;
        wx.showToast({
          title: '解除绑定成功!',
          icon: 'success',
          duration: 1500,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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