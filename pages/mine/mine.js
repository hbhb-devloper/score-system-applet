// pages/mine/mine.js
const app = getApp(),
      util = require('../../utils/util.js');
Page({

  /*页面的初始数据 */
  data: {
    userLevel:'',
    tabbar:[
      {
        text:'评分',
        image:'../../images/votes.png',
        link:'/pages/index/index'
      },
      {
        text: '我的',
        image: '../../images/admin.png',
        active:true
      }
    ]
  },

  /*生命周期函数--监听页面加载 */
  onLoad: function (options) {

  },

  /*生命周期函数--监听页面初次渲染完成 */
  onReady: function () {

  },

  /*生命周期函数--监听页面显示 */
  onShow: function () {
    let that=this;
    app.getSetting(function(){
      console.log(app.globalData.userlevel)
      if (app.globalData.userlevel == 1) {
        that.setData({
          userLevel: '总经理'
        })
      } else if (app.globalData.userlevel == 2) {
        that.setData({
          userLevel: '部门经理'
        })
      }
      wx.hideLoading()
    })
  },

  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },

  /*生命周期函数--监听页面隐藏 */
  onHide: function () {

  },

  toRecords(){
    wx.navigateTo({
      url: '/pages/voteRecords/voteRecords',
    })
  },

  toSetting(){
    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  },

  toVote(e){
    let index = e.currentTarget.dataset.index,
        tabbar = this.data.tabbar;
    wx.redirectTo({
      url: tabbar[index].link,
    })
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
    this.onShow()
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