let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType: 0,
    imgUrls: [
      '/resources/scan-img_03.png',
      '/resources/scan-img_03.png',
      '/resources/scan-img_03.png'
    ],
    detailPic: '',
    treeHeadTextVal: '',
    TreePlace: '',
    NurseryName: '',
    CheckerUser: '',
    InputerUser: '',
    SupervisorUser: '',
    TreeTypeGenera: '',
    ZZBM: '',
    xj: '',
    gd: '',
    gf: '',
    dj: '',
    qmsj: '',
    zzsj: '',
    aboutMeVal: '',
    curringtype: [],
    curings: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    var code = options['code'];
    if (code != undefined && code != null) {
      self.loadCuringType(code).then(self.loadCuring)
      self.loadTree(code).then(e=>{
        if (self.data.InputerUser == ""){
          wx.request({
            url: app.globalData.url + '/wx/volunteertrees?sxm=' + code,
            success: res=>{
              if(res.data.content[0]){
                self.setData({
                  InputerUser: res.data.content[0].Full_Name
                })
              }
            }
          })
        }
      }).catch(e=>{
        wx.showToast({
          title: '该树木无信息',
          icon: 'none',
          mask: true,
          duration: 1200,
        })
        setTimeout(e=>{
          wx.navigateBack({
            delta: -1,
          })
        }, 1200);
      });
      self.loadNursery(code);
    }
    this.setData({
      userType: app.globalData.isbind,
    })
  },
  // 养护任务类型
  loadCuringType(code){
    let self = this;
    return new Promise((resolve, reject)=>{
      wx.request({
        url: app.globalData.url + '/curing/curingtypes',
        header: app.globalData.header,
        success(res) {
          let response = res.data.content
          if (response.length > 0) {
            self.setData({
              curringtype: response,
            })
          }
          resolve(code);
        },
        fail(e) {
          console.log(e);
          reject();
        }
      })
    })
      
  },

  //扫描树木详情
  loadTree: function (data) {
    var self = this;
    return new Promise((resolve, reject)=>{
      wx.request({
        url: app.globalData.url + '/tree/treetype?sxm=' + data,
        method: 'GET', 
        header: app.globalData.header,
        success: function (res) {
          try {
            var response = res.data;
            let detailPic = getApp().globalData.v_WEBSET + '/' + response["Pics"];
            let arr = [detailPic];
            self.data.treeHeadTextVal = response["TreeTypeName"];
            self.data.myInforListVal = response["TreeTypeName"];
            self.data.aboutMeVal = response["GrowthHabit"];
            self.data.zzsj = response["CreateTime"].replace(/\//g, "-");
            self.data.xj = response["XJ"];
            self.data.gd = response["GD"];
            self.data.gf = response["GF"];
            self.data.dj = response["DJ"];

            if (response.CheckerUser != null) {
              if (response.CheckerUser.Full_Name == null) {
                self.data.CheckerUser = '';
              } else {
                self.data.CheckerUser = response.CheckerUser.Full_Name;
              }
            } else {
              self.data.CheckerUser = '';
            }
            if (response.InputerUser != null) {
              if (response.InputerUser.Full_Name == null) {
                self.data.InputerUser = '';
              } else {
                self.data.InputerUser = response.InputerUser.Full_Name;
              }
            }

            if (response.SupervisorUser != null) {
              if (response.SupervisorUser.Full_Name == null) {
                self.data.SupervisorUser = '';
              } else {
                self.data.SupervisorUser = response.SupervisorUser.Full_Name;
              }
            } else {
              self.data.SupervisorUser = '';
            }

            self.data.TreeTypeGenera = response["TreeTypeGenera"];

            self.setData({
              xj: self.data.xj,
              gd: self.data.gd,
              gf: self.data.gf,
              dj: self.data.dj,
              detailPic: arr,
              treeHeadTextVal: self.data.treeHeadTextVal,
              myInforListVal: self.data.myInforListVal,
              zzsj: self.data.zzsj,
              CheckerUser: self.data.CheckerUser,
              InputerUser: self.data.InputerUser,
              SupervisorUser: self.data.SupervisorUser,
              TreeTypeGenera: self.data.TreeTypeGenera,
              aboutMeVal: self.data.aboutMeVal
            });
            resolve();
          } catch (e) {
            console.log(e);
            reject();
          }
        },
        fail: function (err) {
          console.log(err)
          reject();
        }
      })
    })
  },

  //扫描苗圃详情
  loadNursery: function (data) {
    var self = this;
    wx.request({
      url: app.globalData.url + '/tree/nurserys?sxm=' + data,
      method: 'GET',
      header: app.globalData.header,
      success: function (res) {
        console.log(res.data.content);
        try {
          var response = res.data.content;
          if (response.length > 0) {
            response = response[0];

            self.data.NurseryName = response["NurseryName"];
            self.data.qmsj = response["CreateTime"].replace(/\//g, "-");
            self.data.TreePlace = response["TreePlace"];
            self.data.ZZBM = response["ZZBM"];
          }
          self.setData({
            NurseryName: self.data.NurseryName,
            qmsj: self.data.qmsj,
            TreePlace: self.data.TreePlace,
            ZZBM: self.data.ZZBM,
          });
        } catch (e) {
          console.log(e);
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  //扫描详情
  loadCuring: function (code) {
    let self = this;
    let data = {
      curings: self.data.curings,
      curringtype: self.data.curringtype,
    }
    for (var i = 0; i < data.curringtype.length; i++) {
      data.curringtype[i].Count = 0;
    }
    wx.request({
      url: app.globalData.url + '/curing/curingtreebytree?sxm=' + code,
      method: 'GET', 
      header: app.globalData.header,
      success: function (res) {
        console.log(res.data);
        try {
          var response = res.data;
          if (response.length > 0) {
            for (var r in response) {
              for (var c in data.curringtype) {
                if (response[r].CuringType == data.curringtype[c].ID) {
                  data.curringtype[c].Count = data.curringtype[c].Count + 1;
                  response[r].CuringTypeName = data.curringtype[c].Base_Name;
                  break;
                }
              }
            }
          }
          data.curings = [];
          for (var i = 0; i < response.length && i < 3; i++)
            data.curings.push(response[i]);
          self.setData(data);
        } catch (e) {
          console.log(e);
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  //跳转GIS定位
  // locationMap(e){
  //   wx.navigateTo({
  //     url: '../gis/gis?code=' + this.data.ZZBM,
  //   })
  // },
})