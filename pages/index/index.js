//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    point_show:false,
    vote_items:[
      { 'title': '部门', content: ['市场', '财务','人力'] },
      { 'title': '总分',scores:[0,0,0] },
      { 'title': '管理效能', intro: [
        '1. 公司“新三者”、“十六字方针”及“一二四五”工作思路在本部门实际贯彻落实情况',
        '2. 针对公司经营发展重点、难点、痛点领域，全力攻坚克难、真抓实干、制定有效管理举措并实施的情况',
        '3. 推动管理层督办各项工作部署在本部门落地的及时性和质量情况'
      ], scores: [0, 0, 0] },
      {
        'title': '组织协调', intro: [
          '1. 部门内组织运营体系的运作效率是否高效，分工是否合理，职责是否明晰',
          '2. 是否统筹公司全局，打通跨部门边界的流程瓶颈；是否协同解决长流程工作疑难问题，团结协作，相互配合，形成整体合力',
          '3. 是否坚持下基层倾听一线声音，坚持问题导向，注重调查研究，能够帮助解决一线突出矛盾和问题'
      ], scores: [0, 0, 0]},
      { 'title': '创新有为', intro: [
        '1. 是否努力破解公司发展难题，团队呈现锐意进取、奋发有为、鼓励创新的创新文化氛围',
        '2. 是否鼓励技术创新、产品创新、管理创新和服务创新，创新成效显著，能够在职责范围内不断产出最佳实践成果',
        '3. 团队凝聚力情况，组织和队伍效率是否不断提升'
      ], scores: [0, 0, 0] },
      { 'title': '风险控制', intro: [
        '1. 是否遵纪守法、严格遵照执行公司各项规章制度，部门内决策、激励、议事制度是否完善',
        '2. 专业领域流程风险控制机制是否健全，相关工作制度及管理办法等是否完善',
        '3. 嵌入式风险管控执行情况，相关风险点及工作手册更新的及时性'
      ], scores: [0, 0, 0] },
    ],
    vote_marks:[[30,25,20,15,10],[20,15,10,5]]
  },

  onLoad() {
    wx.hideLoading()
  },

  vote(e){
    let index = e.currentTarget.dataset.index,
        idx = e.currentTarget.dataset.idx,
        vote_items = this.data.vote_items;
    this.data.vote_items[index].scores[idx]=e.detail.value
    if (vote_items[2].scores[idx] != 0 && vote_items[3].scores[idx] != 0 && vote_items[4].scores[idx] != 0 && vote_items[5].scores[idx] != 0){
      vote_items[1].scores[idx] = Number(vote_items[2].scores[idx]) + Number(vote_items[3].scores[idx]) + Number(vote_items[4].scores[idx]) + Number(vote_items[5].scores[idx])
    }
    this.setData({
      vote_items:vote_items
    })
  },

  showPoint(e){
    let index = e.currentTarget.dataset.index,
        vote_items = this.data.vote_items;
    vote_items[index].active=true;
    this.setData({
      vote_items: vote_items
    })
  },

  hidePoint(e) {
    let index = e.currentTarget.dataset.index,
        vote_items = this.data.vote_items;
    vote_items[index].active = false;
    this.setData({
      vote_items: vote_items
    })
  }

})