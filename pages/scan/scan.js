// pages/scan/scan.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbind: 0,
    images: '',
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  //事件处理函数
  bindUserTap(e) {
    let type = e.target.dataset.type;
    let self = this;
    wx.showToast({
      title: '正在验证身份...',
      icon: 'loading',
      duration: 1500,
    });
    this.wxisVolunteerBind().then(e => {
      let isbind = app.globalData.isVolunteerBind;
      if (isbind == 1) {
        wx.showToast({
          title: '已进行过认证',
          icon: 'success',
          duration: 1000,
          success: res => {
            setTimeout(e => {
              self.pageJudeg(2);
            }, 1000);
          }
        })
      } else {
        wx.navigateTo({
          url: '../userBind/userBind',
        })
      }
    })
  },
  //点击扫描
  showScanQRCode(e) {
    var self = this;
    wx.showActionSheet({
      itemList: ['扫一扫','拍照识别','从相册选择'],
      success: res=>{
        switch (res.tapIndex) {
          case 0:
            self.scanCode();
            break;
          case 1:
            self.camera(0);
            break;
          case 2:
            self.camera(1);
            break;
        }
      }
    })
  },
  // 扫一扫
  scanCode() {
    wx.scanCode({
      scanType: 'qrCode',
      onlyFromCamera: true,
      success: (res) => {
        wx.navigateTo({
          url: '../information/information?code=' + res["result"]
        });
      }
    })
  },
  // 拍照
  camera(type){
    let self = this;
    let arr = ['camera', 'album'];
    let sourceType = [arr[type]];
    let date = new Date().getTime();
    wx.chooseImage({
      count: 1,
      sourceType: sourceType,
      success: res => {
        let img = res.tempFilePaths[0];
        console.log(res.tempFilePaths[0]);
        // 图片转base64上传形色接口
        let file = wx.getFileSystemManager();
        file.readFile({
          filePath: res.tempFilePaths[0],
          encoding: 'base64',
          success: res=>{
            wx.request({
              url: 'https://plantapi.xingseapp.com/item/identification',
              method: 'POST',
              data: {
                image_data: res.data
              },
              header: {
                'Authorization': 'APPCODE c091fa7360bc48ff87a3471f028d5645',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: res => {
                let response = res.data.response;
                if (res.data.result == 1){
                  self.navPlanrDetail(response.identify_results, img);
                }
                console.log(res.data)
              }
            })
          }
        })
      }
    })
  },
  navPlanrDetail(list, img){
    app.globalData.identList = list;
    app.globalData.identImg = img;
    wx.navigateTo({
      url: '../selectplant/selectplant',
    })
  },
  // 授权微信绑定
  bindwx(){
    if(app.globalData.openid == ""){
      wx.showToast({
        title: '正在加载中...',
        icon: 'loading',
        duration: 1500,
      })
    }else{
      wx.navigateTo({
        url: '../userBind/userBind'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let self = this;  
  },
  wxisbind(){
    return new Promise((reslove, reject)=>{
      wx.request({
        url: app.data.url + 'wx/wxisbind?openid=' + app.globalData.dataId.openid,
        success: res => {
          if (res.errMsg == 'request:ok') {
            console.log(res.data);
            app.globalData.isbind = res.data;
            reslove();
            this.setData({
              isbind: res.data
            })
          } else {
            reject();
          }
        },
        fail: e=>{
          reject();
        }
      })
    })
    
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