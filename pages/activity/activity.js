// pages/activity/activity.js
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    treecode: '',
    treeData: null,//树木信息
    imgbox: [
      {type: '胸径', list: []},
      {type: '高度', list: []},
      {type: '冠幅', list: []},
      {type: '地径', list: []},
    ],
    photo: [],
    valueXJ: '',
    valueGD: '',
    valueGF: '',
    valueDJ: '',
    isXJ: false,
    isGD: false,
    isGF: false,
    isDJ: false,

    isDK: false,
    arrayDK: [],//地块信息
    idxDK: 0,
    valueDK: '',
    arrayBD: [],//标段信息
    idxBD: 0,
    valueBD: '',
    arrayXB: [],//小班信息
    idxXB: 0,
    valueXB: '',
    arrayXXB: [],//细班信息
    idxXXB: 0,
    valueXXB: '',
    section: '',
    smallClass: '',
    thinClass: '',
    arraySZ: [[{ name: "常绿乔木" }, { name: "落叶乔木" }, { name: "亚乔木" }, { name: "灌木" }, { name: "地被" }], [{ name: '请选择树种' }]],
    idxSZ: [0, 0],
    messageSZ: [],
    valueSZ: '',
    treeTypeArr: [],//树种数组
    treeType: '',//树种名称
    szcode: 0,//树种code
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      treecode: options.code,
    })
  },
  tapPickerDK() {
    if (!this.data.isDK) {
      wx.showToast({
        title: '请等待加载',
        icon: 'loading',
        duration: 1500,
      })
      return;
    }
  },
  bindPickerChangeDK(e) {
    let data = this.data;
    this.setData({   //给变量赋值
      idxDK: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
      valueDK: data.arrayDK[e.detail.value].Land,
      arrayBD: data.arrayDK[e.detail.value].UnitProject,
    })
  },
  tapPickerBD() {
    if (this.data.arrayBD.length == 0) {
      wx.showToast({
        title: '请选择地块',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
  },
  bindPickerChangeBD(e) {
    let data = this.data;
    this.setData({   //给变量赋值
      idxBD: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
      valueBD: data.arrayBD[e.detail.value].UnitProjectName,
      arrayXB: data.arrayDK[data.idxDK].UnitProject[e.detail.value].SmallClass
    })
  },
  tapPickerXB() {
    if (this.data.arrayXB.length == 0) {
      wx.showToast({
        title: '请选择标段',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
  },
  bindPickerChangeXB(e) {
    let data = this.data;
    this.setData({   //给变量赋值
      idxXB: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
      valueXB: data.arrayXB[e.detail.value].SmallClassName,
      arrayXXB: data.arrayDK[data.idxDK].UnitProject[data.idxBD].SmallClass[e.detail.value].ThinClass
    })
  },
  tapPickerXXB() {
    if (this.data.arrayXXB.length == 0) {
      wx.showToast({
        title: '请选择小班',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
  },
  bindPickerChangeXXB(e) {
    let data = this.data;
    this.setData({   //给变量赋值
      idxXXB: e.detail.value,  //每次选择了下拉列表的内容同时修改下标然后修改显示的内容，显示的内容和选择的内容一致
      valueXXB: data.arrayXXB[e.detail.value].ThinClassName,
      section: data.arrayXXB[e.detail.value].Section,
      smallClass: data.arrayXXB[e.detail.value].SmallClass,
      thinClass: data.arrayXXB[e.detail.value].ThinClass,
    })
  },
  bindPickerChangeSZ(e) {
    this.setData({
      idxSZ: e.detail.value,
      valueSZ: e.currentTarget.dataset.value,
    })
  },
  tapSZPicker() {
    var data = {
      arraySZ: this.data.arraySZ,
      idxSZ: this.data.idxSZ
    };
    data.arraySZ[1] = this.data.messageSZ[0].arr;
    this.setData(data);
  },
  bindColumnChangeSZ(e) {
    var data = {
      arraySZ: this.data.arraySZ,
      idxSZ: this.data.idxSZ
    };
    data.idxSZ[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      data.arraySZ[1] = this.data.messageSZ[e.detail.value].arr;
    } else if (e.detail.column == 1) {
      data.idxSZ[0] = 0;
    }
    this.setData(data);
  },
  XJInput(e) {
    this.setData({
      valueXJ: e.detail.value
    })
  },
  GDInput(e) {
    this.setData({
      valueGD: e.detail.value
    })
  },
  GFInput(e) {
    this.setData({
      valueGF: e.detail.value
    })
  },
  DJInput(e) {
    this.setData({
      valueDJ: e.detail.value
    })
  },
  //提交函数
  submit() {
    let data = this.data;
    console.log()
    let date = Date.parse(new Date());
    let requestArr = [];
    if (data.valueDK == '' || data.valueBD == '' || data.valueXB == '' || data.valueXXB == '' ){
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
    this.data.imgbox.forEach((item, idx)=>{
      if(item.list){
        item.list.forEach((items, index)=>{
          if (items.indexOf('https://xatree-1.oss-cn-qingdao.aliyuncs.com') == -1){
            requestArr.push(this.uploadFiles(items, idx, index, date, 'list'));
          }
        })
      }
    });
    this.data.photo.forEach((items, index)=>{
      if (items.indexOf('https://xatree-1.oss-cn-qingdao.aliyuncs.com') == -1){
        requestArr.push(this.uploadFiles(items, null, index, date, 'photo'));
      }
    })
    Promise.all(requestArr).then(this.updataTree).then(()=>{
      wx.showToast({
        title: '上传成功',
        icon: 'succes',
        duration: 1500,
        success: res => {
          setTimeout(() => {
            wx.redirectTo({
              url: '../certlist/certlist',
            })
          }, 1500)
        }
      })
    }).catch(()=>{
      wx.showToast({
        title: '上传失败',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    });
  },
  // 上传树木信息
  updataTree() {
    let self = this;
    return new Promise((resolve, reject) => {
      let date = self.formatDateTime(new Date());
      let data = self.data;
      let isPopup = true;
      let GD = 0, GDFJ = '', GF = 0, GFFJ = '', XJ = 0, XJFJ = '', DJ = 0, DJFJ = '';
      if (data.treeData){
        let strType = data.treeData.TreeTypeObj.TreeParam;
        if (strType.indexOf('胸径') != -1) { XJ = data.valueXJ; XJFJ = self.data.imgbox[0].list.join(","); popup(XJ, XJFJ); };
        if (strType.indexOf('高度') != -1) { GD = data.valueGD; GDFJ = self.data.imgbox[1].list.join(","); popup(GD, GDFJ); };
        if (strType.indexOf('冠幅') != -1) { GF = data.valueGF; GFFJ = self.data.imgbox[2].list.join(","); popup(GF, GFFJ); };
        if (strType.indexOf('地径') != -1) { DJ = data.valueDJ; DJFJ = self.data.imgbox[3].list.join(","); popup(DJ, DJFJ); };
      }
      function popup(aa, bb) {
        if (!aa || !bb) {
          wx.showToast({
            title: '请补充数据',
            icon: 'none',
            duration: 1500,
          })
          isPopup = false;
        }
      }
      if (!isPopup) { return; }//未填写完数据终止函数
      let postData = {
        "GD": GD,
        "GDFJ": GDFJ,
        "GF": GF,
        "GFFJ": GFFJ,
        "XJ": XJ,
        "XJFJ": XJFJ,
        "DJ": DJ,
        "DJFJ": DJFJ,
        // "TreeType": data.messageSZ[data.idxSZ[0]].arr[data.idxSZ[1]].code,
        "TreeType": data.szcode.code,
        "ZZBM": data.treecode,
        "Land": data.section.split('-')[0],  //地块
        "Region": data.section.split('-')[1],  //区块
        "Section": data.section,
        "SmallClass": data.smallClass,
        "ThinClass": data.thinClass,
        "YSSJ": date,
        "ZZSJ": date,
        "OpenID": app.globalData.dataId.openid,
        "Photo": data.photo ? data.photo.join(",") : '',
        "VolunteerRemark": '',
        // "BCH": data.treeData.BCH,
        // "GP": data.treeData.GP,
        // "GXWZ": data.treeData.GXWZ,
        // "Inputer": data.treeData.Inputer,
        // "JG": data.treeData.JG,
        // "Num": data.treeData.Num, //灌木数量 新增
        // "SZJZ": data.treeData.SZJZ,
        // "TQHD": data.treeData.TQHD,
        // "TQHDFJ": data.treeData.TQHDFJ,
        // "TQZJ": data.treeData.TQZJ,
        // "TQZJFJ": data.treeData.TQZJFJ,
        // "WZBH": data.treeData.WZBH,
        "BCH": 1,
        "GP": 1,
        "GXWZ": 0,
        "Inputer": 0,
        "JG": 1,
        "Num": 0, //灌木数量 新增
        "SZJZ": 1,
        "TQHD": 0,
        "TQHDFJ": '',
        "TQZJ": 0,
        "TQZJFJ": '',
        "WZBH": '',
      };
      console.log(JSON.stringify(postData));
      wx.request({
        url: app.globalData.url + '/tree/volunteertree',
        header: app.globalData.header,
        method: 'post',
        data: postData,
        success(res) {
          if (res.data.code == 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000,
              mask: true
            })
            reject();
          } else if (res.data.code == 1) {
            resolve();
          }
        },
        fail(e) {
          wx.showToast({
            title: e.data.msg,
            icon: 'none',
            duration: 1000,
            mask: true
          })
          console.log(e)
        },
      })
    })
  },
  // 上传照片信息
  uploadFiles(filePath, index, count, name, type){
    let self = this;
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: app.globalData.url + '/OSSUploadHandler.ashx?filetype=pics',
        header: app.globalData.header,
        filePath: filePath,
        name: name.toString(),
        success(res) {
          if(type=='list'){
            let imgbox = self.data.imgbox;
            imgbox[index].list[count] = res.data;
            self.setData({
              imgbox: imgbox,
            })
          } else if (type == 'photo') {
            let photo = self.data.photo;
            photo[count] = res.data;
            self.setData({
              photo: photo,
            })
          }
          resolve();
        },
        fail(e) {
          wx.showToast({
            title: '上传照片失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          console.log(e);
          reject();
        },
      })
    })
  },
  // 删除照片
  imgDelete: function (e) {
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.deindex;
    let data = {
      imgbox: this.data.imgbox,
      photo: this.data.photo,
    };
    if(type < 4){
      data.imgbox[type].list.splice(index, 1);
    }else if(type == 4){
      data.photo.splice(index, 1);
    }
    this.setData(data)
  },
  // 添加图片
  addPic: function (e) {
    let type = e.currentTarget.dataset.type;
    let data = {
      imgbox: this.data.imgbox,
      photo: this.data.photo,
    };
    let imgbox;
    if (type == 4){
      imgbox = data.photo;
    }else if(type < 4){
      imgbox = data.imgbox[type].list;
    }
    var picid = e.currentTarget.dataset.pic;
    var self = this;
    var n = 9;
    if (9 > imgbox.length > 0) {
      n = 9 - imgbox.length;
    } else if (imgbox.length == 9) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if(type < 4){
          if (imgbox.length == 0) {
            data.imgbox[type].list = tempFilePaths;
          } else if (9 > imgbox.length) {
            data.imgbox[type].list = imgbox.concat(tempFilePaths);
          } else {
            data.imgbox[type].list[picid] = tempFilePaths[0];
          }
        } else if (type == 4) {
          if (imgbox.length == 0) {
            data.photo = tempFilePaths;
          } else if (9 > imgbox.length) {
            data.photo = imgbox.concat(tempFilePaths);
          } else {
            data.photo[picid] = tempFilePaths[0];
          }
        }
        self.setData(data);
      }
    })
  },
  // 扫描详情
  loadTree: function (data) {
    var self = this;
    var pc = new WXBizDataCrypt()
    var singninfo = pc.encrypt(getApp().globalData.v_OPENID, "ur6ifqeOWSsqj7JC")
    wx.request({
      url: getApp().globalData.v_WEBSET + '/tree/treetype?sxm=' + data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { USERID: getApp().globalData.v_OPENID, SINGNINFO: singninfo }, // 设置请求的 header
      success: function (res) {
        console.log(res.data);
        try {
          var response = res.data;
          self.data.detailPic = getApp().globalData.v_WEBSET + '/' + response["Pics"];
          self.data.treeHeadTextVal = response["TreeTypeName"];
          self.data.myInforListVal = response["TreeTypeName"];
          self.data.aboutMeVal = response["GrowthHabit"];
          self.data.zzsj = response["CreateTime"];
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
            detailPic: self.data.detailPic,
            treeHeadTextVal: self.data.treeHeadTextVal,
            myInforListVal: self.data.myInforListVal,
            zzsj: self.data.zzsj,
            CheckerUser: self.data.CheckerUser,
            InputerUser: self.data.InputerUser,
            SupervisorUser: self.data.SupervisorUser,
            TreeTypeGenera: self.data.TreeTypeGenera,
            aboutMeVal: self.data.aboutMeVal
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
  // 树木信息
  requestTree(){
    let self = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + '/tree/treenurserys?sxm=' + this.data.treecode,
        // 树木信息应该调用volunteertrees接口，接口还差一个顺序码查询条件
        // url: app.data.url + 'tree/volunteertrees?sxm=' + this.data.treecode,
        header: app.globalData.header,
        success(res) {
          let data = res.data.content[0];
          if(data){
            let imgbox = [
              { type: '胸径', list: [] },
              { type: '高度', list: [] },
              { type: '冠幅', list: [] },
            ];
            imgbox[0].list = (data.XJFJ != '' ? data.XJFJ.split(',') : []);
            imgbox[1].list = (data.GDFJ != '' ? data.GDFJ.split(',') : []);
            imgbox[2].list = (data.GFFJ != '' ? data.GFFJ.split(',') : []);
            let isXJ = false, isGD = false, isGF = false;
            if (data.TreeTypeObj.TreeParam.indexOf('径') != -1) { isXJ = true };
            if (data.TreeTypeObj.TreeParam.indexOf('高度') != -1) { isGD = true };
            if (data.TreeTypeObj.TreeParam.indexOf('冠幅') != -1) { isGF = true };
            let noarr = data.No.split("-");
            self.setData({
              valueDK: noarr[0],
              valueXJ: data.XJ == 0 ? '' : data.XJ,
              valueGD: data.GD == 0 ? '' : data.GD,
              valueGF: data.GF == 0 ? '' : data.GF,
              imgbox: imgbox,
              treeData: data,
              isXJ: isXJ,
              isGD: isGD,
              isGF: isGF,
              treeType: data.TreeTypeObj.TreeTypeName,
            })
          }
          resolve();
        },
        fail(e) {
          console.log(e)
          reject();
        },
      })
    })
  },
  requestVolunteerTree() {
    let self = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + '/tree/volunteertrees?sxm=' + this.data.treecode,
        header: app.globalData.header,
        success(res) {
          let data = res.data.content[0];
          if (data){
            let treeParam = data.TreeTypeObj.TreeParam;
            data.SmallClass = data.SmallClass.split('-')[3];
            data.ThinClass = data.ThinClass.split('-')[4];
            let imgbox = [
              { type: '胸径', list: [] },
              { type: '高度', list: [] },
              { type: '冠幅', list: [] },
              { type: '地径', list: [] },
            ];
            let isXJ = false, isGD = false, isGF = false, isDJ = false;
            if (treeParam.indexOf('胸径') != -1) { isXJ = true };
            if (treeParam.indexOf('高度') != -1) { isGD = true };
            if (treeParam.indexOf('冠幅') != -1) { isGF = true };
            if (treeParam.indexOf('地径') != -1) { isDJ = true };
            let photo = data.Photo ? data.Photo.split(',') : '';
            self.setData({
              treeType: data.TreeTypeObj.TreeTypeName,
              imgbox: imgbox,
              treeData: data,
              isXJ: isXJ,
              isGD: isGD,
              isGF: isGF,
              isDJ: isDJ,
              photo: photo,
            })
          }
          resolve();
        }
      })
    })
  },
  // 请求地块
  requestDK() {
    let self = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + '/tree/wpunittree',
        header: app.globalData.header,
        success(res) {
          let dkarr = [], msgDK = [], title = '';
          res.data.forEach(item => {
            if (item.Parent == null || item.Parent == '') {
              // dkarr.push(item.Name);
              // msgDK.push(item);
              if (item.No == self.data.treeData.Section.split('-')[0]) {
                title = item.Name;
              }
            }
          })
          self.setData({
            titleDK: title,
          })
          resolve();
        },
        fail(res) {
          console.log(res);
          reject();
        },
      });
    });
  },
  // 请求分级地块标段信息
  requestDKBD() {
    let self = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + '/tree/wpunit4apps?parent=' + this.data.valueDK,
        header: app.globalData.header,
        success(res) {
          let mapNo = {}, mapBD = {}, mapXB = {}, arrBD = [], msg = [];
          res.data.forEach(item => {
            if (!mapNo[item.Land]) {
              msg.push({ Land: item.Land, UnitProject: [] });
              msg[msg.length - 1].UnitProject.push({ UnitProjectName: item.UnitProjectName, SmallClass: [{ SmallClassName: item.SmallClassName, ThinClass: [{ ThinClassName: item.ThinClassName, Section: item.LandNo + '-' + item.RegionNo + '-' + item.UnitProjectNo, SmallClass: item.SmallClass, ThinClass: item.ThinClass }] }] });
              mapNo[item.Land] = item.Land;
              mapBD[item.Land + item.UnitProjectName] = item.UnitProjectName;
              mapXB[item.Land + item.UnitProjectName + item.SmallClassName] = item.SmallClassName;
              // console.log(item)
            } else {
              for (let i in msg) {
                if (msg[i].Land == item.Land) {
                  if (!mapBD[item.Land + item.UnitProjectName]) {
                    msg[i].UnitProject.push({ UnitProjectName: item.UnitProjectName, SmallClass: [{ SmallClassName: item.SmallClassName, ThinClass: [{ ThinClassName: item.ThinClassName, Section: item.LandNo + '-' + item.RegionNo + '-' + item.UnitProjectNo, SmallClass: item.SmallClass, ThinClass: item.ThinClass }] }] });
                    mapBD[item.Land + item.UnitProjectName] = item.UnitProjectName;
                  } else {
                    for (let j in msg[i].UnitProject) {
                      if (msg[i].UnitProject[j].UnitProjectName == item.UnitProjectName) {
                        if (!mapXB[item.Land + item.UnitProjectName + item.SmallClassName]) {
                          msg[i].UnitProject[j].SmallClass.push({ SmallClassName: item.SmallClassName, ThinClass: [{ ThinClassName: item.ThinClassName, Section: item.LandNo + '-' + item.RegionNo + '-' + item.UnitProjectNo, SmallClass: item.SmallClass, ThinClass: item.ThinClass }] });
                          mapXB[item.Land + item.UnitProjectName + item.SmallClassName] = item.SmallClassName;
                        } else {
                          for (let k in msg[i].UnitProject[j].SmallClass) {
                            if (msg[i].UnitProject[j].SmallClass[k].SmallClassName == item.SmallClassName) {
                              msg[i].UnitProject[j].SmallClass[k].ThinClass.push({ ThinClassName: item.ThinClassName, Section: item.LandNo + '-' + item.RegionNo + '-' + item.UnitProjectNo, SmallClass: item.SmallClass, ThinClass: item.ThinClass });
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          })
          // console.log(msg)
          self.setData({
            arrayDK: msg,
            isDK: true,
          })
          resolve();
        },
        fail(res) {
          console.log(res);
          reject();
        },
      });
    });
  },
  //树种分类
  requestSZ() {
    let self = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + "/tree/treetypes",
        header: app.globalData.header,
        success(res) {
          let array = [
            { type: '常绿乔木', arr: [] },
            { type: '落叶乔木', arr: [] },
            { type: '亚乔木', arr: [] },
            { type: '灌木', arr: [] },
            { type: '地被', arr: [] },
          ];
          res.data.forEach(item => {
            let type = item.TreeTypeNo.substring(0, 1);
            array[type - 1].arr.push({ name: item.TreeTypeName, code: item.ID });
          })
          console.log(array)
          self.setData({
            messageSZ: array,
          })
        },
      })
    })
  },
  tree(){
    let self = this;
    return new Promise((resolve, reject)=>{
      wx.request({
        url: app.globalData.url + '/tree/volunteertrees?openid=' + app.globalData.dataId.openid,
        header: app.globalData.header,
        success(res) {
          console.log(res.data);
        },
        fail(e) {
          console.log(e);
          reject();
        },
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let self = this;
    this.requestNurserysSZ().then(() => {
      // this.requestDK();
      // this.requestBD();
      this.requestSZ();
      this.requestDKBD();
    });
  },





  requestNurserysSZ() {
    let self = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.url + '/tree/nurserys?sxm=' + this.data.treecode,
        // 树木信息应该调用volunteertrees接口，接口还差一个顺序码查询条件
        // url: app.data.url + 'tree/volunteertrees?sxm=' + this.data.treecode,
        header: app.globalData.header,
        success(res) {
          let data = res.data.content[0];
          if (data) {
            let treeParam = data.TreeTypeObj.TreeParam;
            let imgbox = [
              { type: '胸径', list: [] },
              { type: '高度', list: [] },
              { type: '冠幅', list: [] },
              { type: '地径', list: [] },
            ];
            let isXJ = false, isGD = false, isGF = false, isDJ = false;
            if (treeParam.indexOf('胸径') != -1) { isXJ = true };
            if (treeParam.indexOf('高度') != -1) { isGD = true };
            if (treeParam.indexOf('冠幅') != -1) { isGF = true };
            if (treeParam.indexOf('地径') != -1) { isDJ = true };
            let photo = data.Photo ? data.Photo.split(',') : '';
            self.setData({
              treeType: data.TreeTypeObj.TreeTypeName,
              imgbox: imgbox,
              treeData: data,
              isXJ: isXJ,
              isGD: isGD,
              isGF: isGF,
              isDJ: isDJ,
              photo: photo, 
              szcode: { name: data.TreeTypeObj.TreeTypeName, code: data.TreeTypeObj.ID },
            })
          }
          resolve();
        },
        fail(e) {
          console.log(e)
          reject();
        },
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

  },
  /*日期格式化*/
  formatDateTime(date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    let minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    let second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
})
