// pages/login/login.js
const app=getApp();

Page({

  /* 页面的初始数据 */
  data: {
    canIUse: wx.canIUse('button.btn_allow[open-type="getUserInfo"]'),
    userInfo: {},
    loading:true,
    hasUserInfo: false,
  },

  /*生命周期函数--监听页面加载 */
  onLoad: function (options) {
    let that=this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      app.login(function () {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.login(function () {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          app.login(function () {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          })
        },
        fail:res=>{
          that.setData({
            loading:false
          })
          wx.hideLoading()
        }
      })
    }
  },

  /*生命周期函数--监听页面初次渲染完成 */
  onReady: function () {

  },

  /*生命周期函数--监听页面显示 */
  onShow: function () {

  },

  refuce: function () {
    wx.showToast({
      icon: 'none',
      title: '您已取消登录！',
    })
  },

  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.errMsg == 'getUserInfo:ok'){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      app.login(function(){
        wx.reLaunch({
          url: '/pages/index/index',
        })
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: '您已取消登录！',
      })
    }
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