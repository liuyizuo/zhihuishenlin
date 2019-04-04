// pages/certificate/certificate.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    treeheader: '/static/treeheader.png',
    treepic: '/static/scan_bg.png',
    userunit: '植树人',
    username: '',
    No: '',//No
    QRcode: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548655606527&di=f4527a6c6d6ec1ddc0e33cb513c7d643&imgtype=0&src=http%3A%2F%2Fimgbdb3.bendibao.com%2Fnjbdb%2F201511%2F10%2F2015111014117844.jpg',
    ZZSJ: '2019年3月5日',
    ZZBM: 'DBM1234',
    treeType: '油松',
    ZZTime: '2019年3月',
    opt: null,

    shade: false,
    canvasHidden: true, //画板隐藏
    shareImgPath: '', //保存图片
    windowWidth: 0, //窗口宽度
    windowHeight: 0, //窗口高度
    screenHeight: 0, //屏幕高度
    imgPath: '', //图片缓存
    imgWidth: 0, //图片宽度
    imgHeight: 0, //图片高度

  },
  shadeTo() {
    if (!this.data.opt) { return; }
    this.setData({
      shade: true,
    })
  },
  shadeBack() {
    this.setData({
      shade: false,
    })
  },
  // 点击跳转到详情页
  navInfo(){
    if (!this.data.opt){ return; }
    wx.navigateTo({
      url: '../information/information?code=' + this.data.ZZBM,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    this.setData({
      opt: options.no ? options.no:null,
    })
    if (!options.no){
      wx.showToast({
        title: '证书加载失败',
        icon: 'none',
      })
      return;
    }
    wx.request({
      url: app.globalData.url + '/wx/volunteertrees?no=' + options.no, 
      // url: 'https://tree.hzvmap.com/wx/volunteertrees?no=' + options.no,
      header: app.globalData.header,
      success(res) {
        let tree = res.data.content[0];
        self.setData({
          username: tree.Full_Name ? tree.Full_Name : app.globalData.userInfo.nickName,
          userunit: tree.Duty,
          No: tree.No,
          ZZBM: tree.SXM,
          treeType: tree.TreeTypeObj.TreeTypeName,
          treepic: tree.Photo,
        })
        // 缓存图片
        wx.getImageInfo({
          src: tree.Photo,
          success: res => {
            console.log(res)
            self.setData({
              imgPath: res.path,
              imgWidth: res.width,
              imgHeight: res.height,
            })
          },
          fail: e => {
            console.log(e)
            wx.showToast({
              title: '图片加载失败',
              icon: 'none',
              duration: 1500,
            })
          }
        })
        // 获取种植时间
        wx.request({
          url: app.globalData.url + '/tree/tree/' + tree.SXM,
          header: app.globalData.header,
          success: res => {
            if (res.data != '') {
              let str = res.data.CreateTime.split(' ')[0].split('/');
              self.setData({
                ZZSJ: str[0] + '年' + str[1] + '月' + str[2] + '日',
                ZZTime: str[0] + '年' + str[1] + '月',
              })
            } else {
              wx.showToast({
                title: '获取时间失败',
                icon: 'none',
                duration: 1500,
              })
            }
          }
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let self = this;
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth*2,
          windowHeight: res.windowHeight*2,
        });
      },
    })
  },

  tap(){
    this.setData({
      canvasHidden: true
    });
  },
  // 分享页面
  shareView() {
    let self = this,
        data = this.data;
    if(data.imgPath == ''){
      wx.showToast({
        title: '图片未加载完毕',
        icon: 'none',
        duration: 1500,
      })
      return;
    }
    wx.showLoading({
      title: '保存中...',
    })
    self.setData({
      canvasHidden: false
    });

    let ctx = wx.createCanvasContext('share');
    let windowWidth = this.data.windowWidth,
        windowHeight = this.data.windowHeight,
        cellWidth = this.data.windowWidth/750;
    let bg = '/static/treeBG.png',
        treeheader = '/static/treeheader.png',
        certno = '/static/certno.png',
        treepic = this.data.treepic;

    ctx.setFillStyle('#fff');
    ctx.fillRect(0, 0, windowWidth, windowHeight);
    ctx.drawImage(bg, windowWidth * 0.01, windowHeight * 0.01, windowWidth * 0.98, windowHeight * 0.98);
    ctx.drawImage(treeheader, cellWidth * 201, cellWidth * 50 + windowHeight * 0.01, cellWidth * 348, cellWidth * 280);

    ctx.setFontSize(28);
    ctx.setFillStyle("#333");
    ctx.fillText('植树人：', 30 + cellWidth * 37, cellWidth * 385 + windowHeight * 0.01);

    ctx.setFontSize(40);
    ctx.setFillStyle("#333");
    ctx.fillText(data.username, (windowWidth - ctx.measureText(data.username).width) / 2, cellWidth * 439 + windowHeight * 0.01);

    ctx.setFontSize(28);
    ctx.setFillStyle("#333");
    let unitlength = windowWidth - cellWidth * 190 - windowHeight * 0.02;
    this.drawText(ctx, data.userunit, (windowWidth - unitlength) / 2, cellWidth * 475 + windowHeight * 0.01, 38, unitlength, true);

    ctx.setFontSize(cellWidth*26);
    ctx.setFillStyle("#636363");
    let notice = '       感谢您参与雄安新区千年秀林义务植树活动，并于' + data.ZZSJ + '成功栽植1棵身份编号为' + data.ZZBM + '的' + data.treeType + '。';
    this.drawText(ctx, notice, cellWidth * 37.5, cellWidth * 562 + windowHeight * 0.01, 38, windowWidth - cellWidth * 75, false);

    ctx.setFontSize(cellWidth * 26);
    ctx.setFillStyle("#636363");
    ctx.fillText('       特发此证，以资鼓励。', cellWidth * 37.5, cellWidth * 642 + windowHeight * 0.01);

    ctx.drawImage(certno, cellWidth * 125, cellWidth * 670 + windowHeight * 0.01, cellWidth * 500, cellWidth * 106);
    ctx.setFontSize(28);
    ctx.setFillStyle("#2BB765");
    ctx.fillText(data.No, (windowWidth - ctx.measureText(data.No).width) / 2, cellWidth * 745 + windowHeight * 0.01);

    let imgWidth = cellWidth * 480, imgHeight = cellWidth * 270;
    if (data.imgWidth / data.imgHeight < 480 / 270){
      imgHeight = cellWidth * 270;
      imgWidth = data.imgWidth * imgHeight / data.imgHeight;
    } else if (data.imgWidth / data.imgHeight > 480 / 270) {
      imgWidth = cellWidth * 480;
      imgHeight = data.imgHeight * imgWidth / data.imgWidth;
    }
    ctx.drawImage(data.imgPath, (windowWidth - imgWidth)/2, cellWidth * 807 + windowHeight * 0.01, imgWidth, imgHeight);

    ctx.setFontSize(26);
    ctx.setFillStyle("#333");
    ctx.fillText('中国雄安集团生态建设投资有限公司', windowWidth - cellWidth * 40 - ctx.measureText('中国雄安集团生态建设投资有限公司').width, windowHeight - cellWidth * 60);

    ctx.draw(false, ()=>{
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: windowWidth,
        height: windowHeight,
        destWidth: windowWidth,
        destHeight: windowHeight,
        canvasId: 'share',
        success: a => {
          self.setData({
            shareImgPath: a.tempFilePath,
            canvasHidden: true,
          });
          // console.log(self.data.shareImgPath)
          // wx.previewImage({
          //   urls: [self.data.shareImgPath]
          // })
          wx.hideLoading()  //图片已经绘制出来，隐藏提示框
        },
        fail: e => { console.log('失败') },
      })
    })
  },
  drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth, center) {
    let data = this.data;
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for(let i = 0; i<str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 36; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        if(center){
          let width = ctx.measureText(str.substring(lastSubStrIndex, i + 1)).width;
          ctx.fillText(str.substring(lastSubStrIndex, i + 1), (data.windowWidth - width) / 2, initHeight);
        } else {
          ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
        }
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight
  },

  keepImg(){
    let self = this;
    wx.saveImageToPhotosAlbum({
      filePath: self.data.shareImgPath,
      success(res) {
        wx.showModal({
          title: '存图成功',
          content: '图片成功保存到相册了，去分享到朋友圈吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              self.setData({
                shareImgPath: '',
              });
            }
          },
          fail:e=>{
            wx.showToast({
              title: '保存图片失败',
              icon: 'none'
            })
          }
        })
      }
    });
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
    return {
      path: '../certificate/certificate?no=' + this.data.No,
    }
  }
})