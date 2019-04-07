//app.js
let CryptoJS = require('./utils/crypto-js.js');
require('./utils/aes.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取接口加密
    wx.request({
      url: this.globalData.url + '/system/login?phone=haojq&pwd=666666',
      success: res=>{
        this.globalData.header = {
          'Content-Type': 'application/json',
          'USERID': res.data[0].ID,
          'SINGNINFO': this.encrypt(res.data[0].ID.toString(), res.data[0].Token.toString()),
        }
      },
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.globalData.url + '/wx/wxinfo?code=' + res.code,
          success: res => {
            console.log(JSON.parse(res.data).openid);
            if (res.data.indexOf('errcode') == -1){
              this.globalData.openid = JSON.parse(res.data).openid;
              this.isBind();
            }else{
              wx.showToast({
                title: '无法获取微信信息',
                icon: 'none',
              })
            }
          },
          fail: e=>{
            console.log(e);
            wx.showToast({
              title: '无法获取微信信息',
              icon: 'none',
            })
          }
        })
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // 判断是否绑定
  isBind() {
    wx.request({
      url: this.globalData.url + '/wx/wxvolunteerisbind?openid=' + this.globalData.openid,
      success: res => {
        if (res.statusCode == 200) {
          if(res.data == 1){
            wx.showToast({
              title: '已绑定账号',
            })
            setTimeout(e=>{
              wx.redirectTo({
                url: '../index/index',
              })
            }, 500);
          }
        } else {
          wx.showToast({
            title: '无法获取绑定信息',
            icon: 'none',
          })
        }
      },
      fail: e => {
        wx.showToast({
          title: '无法获取绑定信息',
          icon: 'none',
        })
      }
    })
  }, 
  changeTabBar() {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.globalData.tabBar;
    for (var i = 0; i < tabBar.list.length; i++) {
      // console.log(_pagePath + '--' + tabBar.list[i].pagePath)
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        if (tabBar.list[i].text != '社交'){
          tabBar.list[i].active = true;//根据页面地址设置当前页面状态  
        }
      }
    }
    _curPage.setData({
      tabBar: tabBar
    });
  },  
  globalData: {
    userInfo: null,
    url: 'https://tree1.hzvmap.com',
    header: '',
    openid: '',
    isbind: 0,
    weburl: '',
    identImg: '',
    identList: [],
    tabBar: {
      "color": "#9E9E9E",
      // "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "text": "地图",
          "iconPath": "/static/map.png",
          "selectedIconPath": "/static/map_sel.png",
          "selectedColor": "#17d399",
          "active": true
        },
        {
          "pagePath": "/pages/index/index",
          "text": "社交",
          "iconPath": "/static/news.png",
          "selectedIconPath": "/static/news_sel.png",
          "selectedColor": "#17d399",
          "active": false
        },
        {
          "pagePath": "/pages/index/index",
          "iconPath": "/static/scanBG.png",
          "selectedColor": "#17d399",
          "scan": true
        },
        {
          "pagePath": "/pages/find/find",
          "text": "发现",
          "iconPath": "/static/find.png",
          "selectedIconPath": "/static/find_sel.png",
          "selectedColor": "#17d399",
          "active": false
        },
        {
          "pagePath": "/pages/certlist/certlist",
          "text": "证书",
          "iconPath": "/static/certificate.png",
          "selectedIconPath": "/static/certificate_sel.png",
          "selectedColor": "#17d399",
          "active": false
        }
      ],
      "position": "bottom"
    },
  },
  // 加密转码
  encrypt(word, key) {
    var key = CryptoJS.enc.Utf8.parse(key);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Utf8.parse("")
    });
    return encrypted.toString();
  },
})