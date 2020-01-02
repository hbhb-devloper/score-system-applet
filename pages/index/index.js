//index.js
//获取应用实例
const app = getApp(),
      WxParse = require('../../utils/wxParse/wxParse.js');

Page({
  data: {
    title:'中国移动杭州评分管理系统',
    vid:null,
    point_show:false,
    save_suc_show:false,
    cantsubmit:true,
    saveText:'',
    saveFail:false,
    pagelock:false,
    vote_items:[
      { 'stand_name': '部门', content: [] },
      { 'stand_name': '总分',scores:[] }]
  },

  onLoad(options) {
    console.log(app.globalData.userInfo)
    if(!app.globalData.token){
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }else{
      this.getDepartList()
      if(options.vid){
        this.setData({
          vid:options.vid,
          title: '第' + options.sign +'期 评分记录表'
        })
      }
    }
  },

  onShow(){
    if(this.data.vid){
      this.getMarkDetail()
    }
  },

  stopMove(){return},

  getDepartList(){
    let that=this,depart=[],dpid=[],scores=[];
    wx.request({
      url: app.globalData.pingshen +'/api/department/departList',
      data:{token:app.globalData.token},
      method:'POST',
      success(res){
        if (res.statusCode == 200) {
          wx.hideLoading()
          if (res.data.code == 1) {
            for (let i = 0; i < res.data.data.list.length; i++) {
              depart.push(res.data.data.list[i].class_name)
              dpid.push(res.data.data.list[i].id)
              scores.push(0)
            }
            that.setData({
              'vote_items[0].content': depart,
              'vote_items[0].ids': dpid,
              'vote_items[1].scores':scores
            })
            that.getStandardList()
          }else{
            app.requestFail(res.data.msg)
          }
        }else{
          app.requestFail('获取部门信息失败，请检查您的网络设置！')
        }
      },
      fail(res) {
        app.requestFail('获取部门信息失败，请检查您的网络设置！')
      },
      complete(res){
      }
    })
  },

  getStandardList(){
    let that = this, vote_items = this.data.vote_items;
    wx.request({
      url: app.globalData.pingshen +'/api/standard/standList',
      data:{token:app.globalData.token},
      method:'POST',
      success(res) {
        if(res.statusCode==200){
          if(res.data.code==1){
            for(let i=0;i<res.data.data.list.length;i++){
              vote_items.push(res.data.data.list[i])
              
            }
            for (let i = 2; i < vote_items.length; i++){
              vote_items[i].stand_text = WxParse.wxParse('text', 'html', vote_items[i].stand_text, that, 5)
              vote_items[i].scores=[]
            }
            that.setData({
              vote_items: vote_items
            })
            console.log(that.data.vote_items)
          }else{
            app.requestFail(res.data.msg)
          }
        }
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  getMarkDetail(){
    let that = this, vote_items = this.data.vote_items;
    wx.request({
      url: app.globalData.pingshen +'/api/standard/markDetail',
      data:{
        token:app.globalData.token,
        id:that.data.vid
      },
      method:'POST',
      success(res){
        if(res.statusCode==200){
          if(res.data.code==1){
            for (let i = 0; i < res.data.data.mark_msg.length; i++) {
              vote_items[1].scores[i] = res.data.data.mark_msg[i].total_score
              console.log(vote_items[1].scores[i])
              for (let j = 0; j < res.data.data.mark_msg[i].score_detail.length; j++) {
                vote_items[j + 2].scores[i] = res.data.data.mark_msg[i].score_detail[j]
              }
            }
            that.setData({
              vote_items:vote_items
            })
          }else{
            that.setData({
              save_suc_show: true,
              saveFail: true,
              saveText: res.data.msg
            })
          }
        }else{
          that.setData({
            save_suc_show: true,
            saveFail: true,
            saveText: '获取评分记录失败，请检查您的网络设置！'
          })
        }
      },
      fail(res){
        that.setData({
          save_suc_show: true,
          saveFail: true,
          saveText: '获取评分记录失败，请检查您的网络设置！'
        })
      }
    })
  },

  vote(e){
    let index = e.currentTarget.dataset.index,
        idx = e.currentTarget.dataset.idx,
        vote_items = this.data.vote_items,
        count=0,
        ttlcount=0;
    vote_items[index].scores[idx]=e.detail.value
    if (vote_items[2].scores[idx] != 0 && vote_items[3].scores[idx] != 0 && vote_items[4].scores[idx] != 0 && vote_items[5].scores[idx] != 0){
      vote_items[1].scores[idx] = Number(vote_items[2].scores[idx]) + Number(vote_items[3].scores[idx]) + Number(vote_items[4].scores[idx]) + Number(vote_items[5].scores[idx])
    }
    this.setData({
      vote_items:vote_items
    })
    for (let i = 0; i < vote_items[0].content.length; i++){
      for (let j = 2; j < vote_items.length; j++) {
        ttlcount++
        if (vote_items[j].scores[i]){
          count++
        }
      }
    }
    if (count==ttlcount){
      this.setData({
        cantsubmit:false
      })
    }else{
      this.setData({
        cantsubmit: true
      })
    }
    console.log('总项数'+ttlcount+'，已打分项数'+count)
    console.log(index,vote_items[index],vote_items[0].content[idx],vote_items[0].ids[idx])
  },

  showPoint(e){
    let index = e.currentTarget.dataset.index,
        vote_items = this.data.vote_items;
    vote_items[index].active=true;
    console.log(vote_items[index])
    wx.pageScrollTo({
      selector: '.vote_top',
      duration:100
    })
    this.setData({
      vote_items: vote_items,
      pagelock:true
    })
  },

  hidePoint(e) {
    let index = e.currentTarget.dataset.index,
        vote_items = this.data.vote_items;
    vote_items[index].active = false;
    this.setData({
      vote_items: vote_items,
      pagelock:false
    })
  },

  saveMark:function(e){
    let that = this, 
    btnText = e.currentTarget.dataset.oper,
    mark_msg = [], 
    vote_items = this.data.vote_items,
    url='';
      // i部门 j指标
    for(let i=0;i<vote_items[0].content.length;i++){
      let scores=[]
      for(let j=2;j<vote_items.length;j++){
          scores.push(vote_items[j].scores[i] || 0)
      }
      mark_msg.push({ c_id: vote_items[0].ids[i], total_score: vote_items[1].scores[i] || 0, score_detail: scores})
      console.log(vote_items[0].ids[i],vote_items[1].scores[i] || 0,scores)
    }
    console.log(mark_msg)
    if (btnText=='保存'){
      url = '/api/standard/saveMark'
    } else if (btnText == '提交'){
      url ='/api/standard/submitMark'
    }
    wx.request({
      url: app.globalData.pingshen +url,
      data:{
        token:app.globalData.token,
        mark_msg: mark_msg
      },
      method:'POST',
      success(res) {
        console.log(res)
        if(res.statusCode==200){
          if(res.data.code==1){
            that.setData({
              save_suc_show: true,
              saveFail: false,
              saveText: btnText+'成功'
            })
          }else{
            that.setData({
              save_suc_show: true,
              saveFail: true,
              saveText: res.data.msg
            })
          }
        }else{
          that.setData({
            save_suc_show: true,
            saveFail:true,
            saveText: btnText+'失败，请稍候再试！'
          })
        }
      },
      fail(res) {
        console.log(res)
        that.setData({
          save_suc_show: true,
          saveFail: true,
          saveText: btnText+'失败，请稍候再试！'
        })
      }
    })
  },

  hideSave(){
    this.setData({
      save_suc_show: false
    })
  },

  toMine(){
    wx.redirectTo({
      url: '/pages/mine/mine',
    })
  }

})