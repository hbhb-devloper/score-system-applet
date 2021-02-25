//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    wx.showLoading({
      title:'加载中...'
    })
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getSetting(cb,fcb){
    let that=this;
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
              if (that.globalData.token) {
                cb()
              } else {
                wx.getUserInfo({
                  success(e) {
                    that.globalData.userInfo = e.userInfo
                    that.login(function () {
                      cb()
                    })
                  },
                })
              }
            }
          })
        } else {
          wx.showModal({
              content: '使用评分系统需先登录',
              showCancel:false,
              confirmColor: '#3A77F7',
              success(res){
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              }
          })
        }
      },
      fail: res => {
        that.requestFail('登录失败，请检查您的网络设置！')
        console.log(res)
        if(fcb && typeof(fcb)==='function'){
          fcb()
        }
      },
      complete:res=>{
        wx.hideLoading()
      }
    })
  },
  // "navigationStyle":"custom", app.json
  login(cb) {
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: this.globalData.pingshen + '/api/users/wxlogin',
            data: {
              code: res.code
            },
            method: 'POST',
            success: e => {
              console.log(e)
              this.globalData.session_key=e.data.data.session_key;
              let data = this.globalData.userInfo;
              data.openid=e.data.data.openid;
              if (e.statusCode == 200) {
                let that = this;
                console.log('登录成功'+JSON.stringify(e))
                if (e.data.code == 2) {
                  wx.request({
                    url: this.globalData.pingshen + '/api/users/reg',
                    data: data,
                    method: 'POST',
                    success: result => {
                      if(result.data.statusCode==200){
                        that.globalData.token=result.data.data.token;
                        that.globalData.userlevel = result.data.data.userlevel
                        if(typeof(cb)==='function'){
                          cb()
                        }
                      }
                      console.log(result)
                    },
                    fail: result => {
                      console.log(result)
                    }
                  })
                } else if (e.data.code == 1){
                  this.globalData.token=e.data.data.token
                  that.globalData.userlevel = e.data.data.userlevel
                  if (typeof (cb) === 'function') {
                    cb()
                  }
                }else{
                  this.requestFail(e.data.msg)
                }
              } else {

              }
            },
            fail: e => {
              console.log(e)
              this.requestFail('登录失败，请检查您的网络设置！')
              wx.navigateBack({})
            },
            complete: e => {
              wx.hideLoading()
            }
          })
        }
      },
      fail: res => {
        console.log('登录失败，请检查您的网络设置！')
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  },
  checkSession(){
    wx.checkSession({
      success:res=>{
        console.log(res)
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  requestFail(msg){
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel:false,
      confirmColor: '#3A77F7'
    })
  },
  globalData: {
    userInfo: null,
    session_key:'',
    token:'',
    submitted:false,
    userlevel:0,
    pingshen:'https://pingshen.hbhb.vip'
    // pingshen:'https://score.yeexun.com.cn'
  }
})