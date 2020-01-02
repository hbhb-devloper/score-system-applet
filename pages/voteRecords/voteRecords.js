// pages/voteRecords/voteRecords.js
const app=getApp(),
      util = require('../../utils/util.js')
Page({

  /*页面的初始数据 */
  data: {
    voteRecords:[]
  },

  /*生命周期函数--监听页面加载 */
  onLoad: function (options) {
  
  },

  /*生命周期函数--监听页面初次渲染完成 */
  onReady: function () {

  },

  /*生命周期函数--监听页面显示 */
  onShow: function () {
    this.getMarkList()
  },

  /*生命周期函数--监听页面隐藏 */
  onHide: function () {

  },

  getMarkList() {
    let that = this, voteRecords=[];
    wx.request({
      url: app.globalData.pingshen + '/api/standard/markList',
      data: { token: app.globalData.token },
      method: 'POST',
      success(res) {
        if(res.statusCode==200){
          if(res.data.code==1){
            voteRecords= res.data.data.reverse()
            //console.log(util.SectionToChinese(20))
            for (let i = 0; i < voteRecords.length;i++){
              voteRecords[i].sign = util.SectionToChinese(voteRecords[i].sign)
              if (voteRecords[i].sign.indexOf('一十')!=-1){
                voteRecords[i].sign.replace('一十', '十')
              }
            }
            that.setData({
              voteRecords: voteRecords
            })
          }
        }
      },
      fail(res) {
        app.requestFail('获取评分记录失败，请刷新页面重试！')
      }
    })
  },

  toVoteResult(e){
    let that=this,
        index = e.currentTarget.dataset.index,
        voteRecords = this.data.voteRecords;
    wx.navigateTo({
      url: '/pages/index/index?vid=' + voteRecords[index].id + '&sign=' + voteRecords[index].sign,
    })
  },

  /* 生命周期函数--监听页面卸载 */
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