const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const menuScan = itemList=>{
  let self = this;
  wx.showActionSheet({
    itemList: itemList,
    success: res => {
      switch (itemList[res.tapIndex]) {
        case '志愿者栽植':
          scanGauge();
          break;
        case '扫一扫':
          scanCode();
          break;
        case '拍照识别':
          camera(0);
          break;
        case '从相册选择':
          camera(1);
          break;
      }
    }
  })
}
const scanGauge = () => {
  var _this = this;
  wx.scanCode({
    scanType: 'qrCode',
    onlyFromCamera: true,
    success: (res) => {
      let code = res["result"];
      //先判断是否已经绑定过，已绑定的按照身份进行跳转
      wx.showToast({
        title: '获取树木信息',
        icon: 'loading',
        duration: 1500,
        success: r => {
          let treeRes = null, volunteerRes = null;
          function tree() {
            return new Promise((resolve, reject) => {
              wx.request({
                url: app.globalData.url + '/tree/tree/' + code,
                header: app.globalData.header,
                success: res => {
                  treeRes = res;
                  resolve();
                },
                fail: e => {
                  reject();
                }
              })
            })
          }
          function nursery() {
            return new Promise((resolve, reject) => {
              wx.request({
                url: app.globalData.url + '/tree/nurserys?sxm=' + code,
                header: app.globalData.header,
                success: res => {
                  if (res.data.content.length > 0) {
                    resolve();
                  } else {
                    wx.showToast({
                      title: '树木信息不存在',
                      icon: 'none',
                      duration: 1500,
                    })
                    reject();
                  }
                },
                fail(e) {
                  reject();
                },
              })
            })
          }
          Promise.all([tree(), nursery()]).then(e => {
            if (!treeRes.data) {
              wx.navigateTo({
                url: '../activity/activity?code=' + code,
              });
            } else if (treeRes.data) {
              wx.showToast({
                title: '树木信息已上传',
                icon: 'none',
                duration: 1500,
              })
            }
          }).catch(e => {
            wx.showToast({
              title: '获取树木信息失败',
              icon: 'none',
              duration: 1500,
            })
          })
        },
      })
    }
  })
}
const scanCode = () => {
  wx.scanCode({
    scanType: 'qrCode',
    onlyFromCamera: true,
    success: (res) => {
      wx.navigateTo({
        url: '/pages/information/information?code=' + res["result"]
      });
    }
  })
}
const camera = type => {
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
        success: res => {
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
              if (res.data.result == 1) {
                app.globalData.identList = response.identify_results;
                app.globalData.identImg = img;
                wx.navigateTo({
                  url: '../selectplant/selectplant',
                })
              }
              console.log(res.data)
            }
          })
        }
      })
    }
  })
}

module.exports = {
  formatTime: formatTime,
  menuScan: menuScan,
  scanGauge: scanGauge,
  scanCode: scanCode,
  camera: camera,
}
