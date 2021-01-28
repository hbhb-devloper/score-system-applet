//index.js
//获取应用实例
const app = getApp(),
  WxParse = require('../../utils/wxParse/wxParse.js');

Page({
  data: {
    loading: true,
    title: '中国移动杭州评分管理系统',
    requestFail: false,
    vid: null,
    sign: null,
    saved: false,
    point_show: false,
    save_suc_show: false,
    cantsubmit: true,
    saveText: '',
    saveFail: false,
    pagelock: false,
    submitted: false,
    vote_items: [{
        'stand_name': '部门',
        content: []
      },
      {
        'stand_name': '总分',
        scores: []
      }
    ]
  },

  onLoad(options) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.getSetting(function () {
      that.setData({
        vote_items: [{
            'stand_name': '部门',
            content: []
          },
          {
            'stand_name': '总分',
            scores: []
          }
        ]
      })
      that.getData(options)
    }, function () {
      that.setData({
        requestFail: true
      })
    })
  },

  onShow() {

  },

  hideToast() {
    wx.hideToast()
  },

  stopMove() {
    return
  },

  navBack() {
    wx.navigateBack({})
  },

  getData(options) {
    if (options.vid) {
      this.setData({
        vid: options.vid,
        sign: options.sign,
        title: '第' + options.signText + '期 评分记录表'
      })
    }
    if (app.globalData.submitted) {
      this.setData({
        submitted: true
      })
    }
    this.getDepartList()
  },

  getDepartList() {
    let that = this,
      depart = [],
      dpid = [],
      scores = [];
    wx.request({
      url: app.globalData.pingshen + '/api/department/departList',
      data: {
        token: app.globalData.token
      },
      method: 'POST',
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            for (let i = 0; i < res.data.data.list.length; i++) {
              depart.push(res.data.data.list[i].class_name)
              dpid.push(res.data.data.list[i].id)
              scores.push(0)
            }
            that.setData({
              'vote_items[0].content': depart,
              'vote_items[0].ids': dpid,
              'vote_items[1].scores': scores
            })
            that.getStandardList()
          } else {
            app.requestFail(res.data.msg)
          }
        } else {

        }
      },
      fail(res) {
        console.log(res)
      },
      complete(res) {}
    })
  },

  getStandardList() {
    let that = this,
      vote_items = this.data.vote_items,
      scores = [];
    wx.request({
      url: app.globalData.pingshen + '/api/standard/standList',
      data: {
        token: app.globalData.token
      },
      method: 'POST',
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            for (let i = 0; i < res.data.data.list.length; i++) {
              console.log(res.data.data.list[i],'评价要点')
              vote_items.push(res.data.data.list[i])
            }
            for (let i = 2; i < vote_items.length; i++) {
              vote_items[i].stand_text = WxParse.wxParse('text', 'html', vote_items[i].stand_text, that)
              vote_items[i].scores = []
            }
            if (res.data.data.mark_msg && res.data.data.mark_msg.length != 0) {
              that.setData({
                saved: true
              })
              for (let i = res.data.data.mark_msg.length - vote_items[0].content.length; i < res.data.data.mark_msg.length; i++) {
                scores.push(res.data.data.mark_msg[i].total_score)
                console.log(vote_items[1])
                for (let j = 0; j < res.data.data.mark_msg[i].score_detail.length; j++) {
                  vote_items[j + 2].scores.push(res.data.data.mark_msg[i].score_detail[j])
                }
              }
              vote_items[1].scores = scores
            }
            that.voteStat(vote_items)
            that.setData({
              loading: false,
              vote_items: vote_items
            })
            wx.hideLoading()
            wx.showToast({
              image: '../../images/arrow.png',
              title: '右滑查看更多',
              duration: 60000
            })
            if (that.data.vid) {
              that.getMarkDetail()
            }
          } else {
            app.requestFail(res.data.msg)
          }
        } else {
          app.requestFail('请求失败，请检查您的网络设置！')
          that.setData({
            requestFail: true
          })
        }
      },
      fail(res) {
        console.log(res)
        app.requestFail('请求失败，请检查您的网络设置！')
        that.setData({
          requestFail: true
        })
      }
    })
  },

  getMarkDetail() {
    let that = this,
      vote_items = this.data.vote_items;
    console.log(this.data.vote_items)
    wx.request({
      url: app.globalData.pingshen + '/api/standard/markDetail',
      data: {
        token: app.globalData.token,
        sign: that.data.sign
      },
      method: 'POST',
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.code == 1) {
            for (let i = 0; i < res.data.data.mark_msg.length; i++) {
              vote_items[1].scores[i] = res.data.data.mark_msg[i].total_score
              console.log(vote_items[1])
              for (let j = 0; j < res.data.data.mark_msg[i].score_detail.length; j++) {
                vote_items[j + 2].scores.push(res.data.data.mark_msg[i].score_detail[j])
              }
            }
            that.setData({
              requestFail: false,
              vote_items: vote_items
            })
          } else {
            that.setData({
              requestFail: true,
              save_suc_show: true,
              saveFail: true,
              saveText: res.data.msg
            })
          }
        } else {
          that.setData({
            requestFail: true,
            save_suc_show: true,
            saveFail: true,
            saveText: '获取评分记录失败，请检查您的网络设置！'
          })
        }
      },
      fail(res) {
        that.setData({
          requestFail: true,
          save_suc_show: true,
          saveFail: true,
          saveText: '获取评分记录失败，请检查您的网络设置！'
        })
      }
    })
  },

  vote(e) {
    let index = e.currentTarget.dataset.index,
      idx = e.currentTarget.dataset.idx,
      vote_items = this.data.vote_items,
      score = 0;
    vote_items[index].scores[idx] = e.detail.value
    for (let i = 2; i < vote_items.length; i++) {
      if (!vote_items[i].scores[idx] || vote_items[i].scores[idx] == 0) {
        return
      } else {
        score += Number(vote_items[i].scores[idx])
        vote_items[1].scores[idx] = score
      }
    }
    // if (vote_items[2].scores[idx] != 0 && vote_items[3].scores[idx] != 0 && vote_items[4].scores[idx] != 0 && vote_items[5].scores[idx] != 0){
    //   vote_items[1].scores[idx] = Number(vote_items[2].scores[idx]) + Number(vote_items[3].scores[idx]) + Number(vote_items[4].scores[idx]) + Number(vote_items[5].scores[idx])
    // }
    this.setData({
      vote_items: vote_items
    })
    this.voteStat(vote_items)
    console.log(index, vote_items[index], vote_items[0].content[idx], vote_items[0].ids[idx])
  },

  voteStat(vote_items) {
    let count = 0,
      ttlcount = 0;
    for (let i = 0; i < vote_items[0].content.length; i++) {
      for (let j = 2; j < vote_items.length; j++) {
        ttlcount++
        if (vote_items[j].scores[i]) {
          count++
        }
      }
    }
    if (count == ttlcount) {
      this.setData({
        cantsubmit: false
      })
    } else {
      this.setData({
        cantsubmit: true
      })
    }
    console.log('总项数' + ttlcount + '，已打分项数' + count)
  },

  showPoint(e) {
    let index = e.currentTarget.dataset.index,
      vote_items = this.data.vote_items;
    vote_items[index].active = true;
    console.log(vote_items[index])
    // wx.pageScrollTo({
    //   selector: '.vote_top',
    //   duration:100
    // })
    this.setData({
      vote_items: vote_items,
      pagelock: true
    })
  },

  hidePoint(e) {
    let index = e.currentTarget.dataset.index,
      vote_items = this.data.vote_items;
    vote_items[index].active = false;
    this.setData({
      vote_items: vote_items,
      pagelock: false
    })
  },

  saveMark: function (e) {
    let that = this,
      btnText = e.currentTarget.dataset.oper,
      mark_msg = [],
      vote_items = this.data.vote_items,
      url = '';
    // i部门 j指标
    for (let i = 0; i < vote_items[0].content.length; i++) {
      let scores = []
      for (let j = 2; j < vote_items.length; j++) {
        scores.push(vote_items[j].scores[i] || 0)
      }
      mark_msg.push({
        c_id: vote_items[0].ids[i],
        total_score: vote_items[1].scores[i] || 0,
        score_detail: scores
      })
      console.log(vote_items[0].ids[i], vote_items[1].scores[i] || 0, scores)
    }
    console.log(mark_msg)

    function submit(url, cb) {
      wx.request({
        url: app.globalData.pingshen + url,
        data: {
          token: app.globalData.token,
          mark_msg: mark_msg
        },
        method: 'POST',
        success(res) {
          console.log(res)
          if (res.statusCode == 200) {
            if (res.data.code == 1) {
              cb()
            } else {
              that.setData({
                save_suc_show: true,
                saveFail: true,
                saveText: res.data.msg
              })
            }
          } else {
            that.setData({
              save_suc_show: true,
              saveFail: true,
              saveText: btnText + '失败，请稍候再试！'
            })
          }
        },
        fail(res) {
          console.log(res)
          that.setData({
            save_suc_show: true,
            saveFail: true,
            saveText: btnText + '失败，请稍候再试！'
          })
        }
      })
    }
    if (btnText == '保存') {
      submit('/api/standard/saveMark', function () {
        that.setData({
          save_suc_show: true,
          saveFail: false,
          saveText: btnText + '成功'
        })
      })
    } else if (btnText == '提交') {
      wx.showModal({
        title: '提交确认',
        content: '提交后将不可修改，确认提交？',
        confirmColor: '#3A77F7',
        success(res) {
          if (res.confirm) {
            submit('/api/standard/submitMark', function () {
              that.setData({
                save_suc_show: true,
                saveFail: false,
                saveText: btnText + '成功',
                submitted: true,
                cantsubmit: true
              })
              app.globalData.submitted = true
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '您已取消操作！',
            })
          }
        }
      })
    }
  },

  hideSave() {
    this.setData({
      save_suc_show: false
    })
  },

  toMine() {
    wx.redirectTo({
      url: '/pages/mine/mine',
    })
  },

  onPullDownRefresh() {
    if (this.data.requestFail) {
      this.onLoad(this.options)
    }
  },

  onShareAppMessage: function () {

  }

})